# FSBattle
# By Derek Tumolo

from __future__ import with_statement

import os
import logging
import pprint
import time
import sys
import datetime
import collections
import random
import traceback
import calendar
import warnings

from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template
from django.utils import simplejson
from google.appengine.ext import db
from google.appengine.api import users as gaeusers

import oauth
import gmemsess
import foursquare


class Badges(db.Model):
# store the users badges? maybe better to simply process them and drop them
  uid = db.IntegerProperty(required=True)
  processed = db.BooleanProperty() # have we generated treasure for this badge yet?

class Player(db.Model):
  user = db.UserProperty()
  name = db.StringProperty()
  exp = db.IntegerProperty(default=0)  
  hp = db.IntegerProperty(default=10)
  gold = db.IntegerProperty(default=0)
  level = db.IntegerProperty(default=1)
  ranged = db.IntegerProperty(default=1)
  melee = db.IntegerProperty(default=1)
  magic = db.IntegerProperty(default=1)
  picture = db.StringProperty()
  
class Foursquare(db.Model):
  pkey = db.ReferenceProperty(Player)
  fsid = db.IntegerProperty()
  token = db.StringProperty()

class Collection(db.Model):
  #the users collection of cards.  actually a join table between user and cards
  # if cards modify other cards, how do we track that?  active set table, below
  uid = db.IntegerProperty(required=True)

class BattleSet(db.Model):
  # the users currently active thing (battle set), which will respond if someone battles them
  # Latest thinking is that its a series of combat moves, which are gained by leveling up, and draw from some
  # set of resources.
  # Said resources refresh over time.
  # Maybe classes refresh resources at different rates?  And have different power options.
  uid = db.IntegerProperty(required=True)
  powerid = db.IntegerProperty(required=True)
  position = db.IntegerProperty(required=True) #there are 5 positions.  attachments are relevant to items, not moves.

#attachments may be added if a position has at 
#least 1 card. I think this makes sense, but maybe not

class Equipment(db.Model):
  name = db.StringProperty()
  ranged = db.IntegerProperty(default=0)
  melee = db.IntegerProperty(default=0)
  magic = db.IntegerProperty(default=0)

class BaselineItem(db.Model):
# going with a diablo like model here.  Baseline items are modified by pre and post fixes.  
  name = db.StringProperty()
  rarity = db.IntegerProperty(required=True) #0 is common, higher numbers are more rare.  
  #again, going diablo style here - for each drop, it will generate a rarity score, that represents roughly the 
  #power of the item to be dropped.
  type = db.IntegerProperty(required=True)

class ItemType(db.Model):
# item types.  weapons, armor, rings, etc
  name = db.StringProperty()
  
  
# initial reg only gives you a user.  is it even stored?
# on connect to foursquare, check the user does not already have an FSB account.  if yes, error, and prompt to auth with a different account,
#   or use a different openid.
    
def get_player():
  user = gaeusers.get_current_user()
  player_q = Player.gql('WHERE user = :1', user)
  players = player_q.fetch(2)
  if len(players) > 0:
    if len(players) > 1:
      logging.error('Multiple records for uid %s: %s' % (user, players))
    return players[0]
  else:
    logging.warn('User %s not in database.' % (user,))
    return None
    
def get_fs():
  player = get_player()
  fs_q = Foursquare.gql('WHERE pkey = :1', player)
  fs_list = fs_q.fetch(2)
  if len(fs_list) > 0:
    if len(fs_list) > 1:
      logging.error('Multiple records for player %s: %s' % (player, fs_list))
    return fs_list[0]
  else:
    logging.warn('Player %s not in database.' % (player,))
    return None

def make_player_record(name, picture):
  return Player(user=gaeusers.get_current_user(), name=name, picture=picture)

class MyRequestHandler(webapp.RequestHandler):
  def handle_exception(self, exception, debug_mode):
    logging.error('exception: %s\n%s' % (repr(exception), str(exception)))
    logging.error('stack trace: %s' % (traceback.format_exc()))
    if debug_mode or not isinstance(exception, ExceptionHandler):
      self.error(500)
      self.response.out.write(str(exception))
    else:
      self.error(exception.http_status)
      self.response.out.write(str(exception))


class ExceptionHandler(Exception):
  def __init__(self, http_status, msg):
    Exception.__init__(self, msg)
    self.http_status = http_status



key_cache = {}

def get_key(name, secret=False):
  if name in key_cache:
    return key_cache[name]

  if secret:
    extension = 'secret'
  else:
    extension = 'key'
    
  path = os.path.join('keys', '%s.%s' % (name, extension))
  with open(path, 'r') as f:
    value = safer_eval(f.read())
  key_cache[name] = value
  return value
  

class Login(webapp.RequestHandler):
    def get(self):
        user = gaeusers.get_current_user()
        if user:
            player = get_player()
            if player:
				greeting = ("Welcome back, %s. <img src = %s> </br><a href='/venues'>Check In</a></br><a href='/equip'>Add equipment mock data</a></br><a href='\import'>Find friends</a></br>(<a href=\"%s\">sign out</a>)" % (player.name, player.picture, gaeusers.create_logout_url("/login")))
            else:
              greeting = ("Welcome, %s! </br> <a href='/authorize'>Connect to Foursquare!</a></br>(<a href=\"%s\">sign out</a>)" %
                        (user.nickname(), gaeusers.create_logout_url("/login")))
			# check if they have an account with FSB yet
			# if no, do the authorize thing
			
			# if yes, show their stats and stuff.  maybe that should redirect.
        else:
            greeting = ("<a href=\"%s\">Sign in or register</a>." %
                        gaeusers.create_login_url("/login"))

        self.response.out.write("<html><body>%s</body></html>" % greeting)

class Import(webapp.RequestHandler):
	def get(self):
		fs = get_fs_from_account()
		
		friends = fs.friends()
		
		#self.response.out.write('friends: %s' % friends)
		
		self.response.out.write("<h1>Your friends are:</h1>")
      
		#get the people checked in
		for friend in friends['friends']:
			#self.response.out.write("%s" % friend)
			self.response.out.write("<img src = %s> %s " % (friend['photo'],  friend['firstname']))
			if 'lastname' in friend:
			  self.response.out.write("%s" % friend['lastname'])
			
			query = db.GqlQuery("SELECT * FROM Foursquare WHERE fsid = :1 ", friend['id'])
			result = query.fetch(1)
			
			if (result):
				self.response.out.write("<a href='/msg?uid=%s'>Message</a>" % 5)
				#results[pkey])
			
			
			#check their relationship. 3 options 
			# 1 - full friend, fs and fsb'
			# 2 - fs friend - invite to fsb
			# 3 - non friend - invite to both? just fsb would be better, but maybe not possible.  for now, no link.
			
			self.response.out.write("</br>")
        
class Venues(webapp.RequestHandler):
  def get(self):
    self.response.out.write('<html><body>')
    
    self.response.out.write("""
          <form action="/venues" method="post"> 
            <div>Lat: <input type="text" name="lat" value="40.7204"/></div> 
            <div>Long: <input type="text" name="long" value="-73.9933"/></div> 
            <div><input type="submit" value="List Venues"></div> 
          </form> 
        </body></html>""")

  def post(self):
    lat = float(self.request.get('lat'))
    long = float(self.request.get('long'))
    
    fs = get_fs_from_account()
    
    logging.info('lat %f, long %f, request %s' % (lat, long, self.request))
    
    #venues = fs.venues(40.7204, -73.9933)
    venues = fs.venues(lat, long)
    
#    obj = json.loads(venues)
    
    self.response.out.write('venues: %s' % venues)
    
    #self.response.out.write('object: %s' % obj)
    
    for group in venues['groups']:
      #self.response.out.write('group %s' % group)
      
      for venue in group['venues']:
        self.response.out.write("""<a href='/checkin?venueid=%s'>Check in to %s</a></br>""" % (venue['id'], venue['name']))
       # if (type == 'Nearby'):
       #   self.response.out.write("""got the nearby""")
        
    #  
      
class EquipData(webapp.RequestHandler):
  def get(self):
    Equipment(name="sword", melee=5).put()
    Equipment(name="wand", magic=5).put()
    Equipment(name="bow", ranged=4).put()
    Equipment(name="shield", melee=2).put()
    Equipment(name="staff", magic=9, melee=2).put()
    Equipment(name="crossbow", ranged=7).put()
    
    self.redirect('/')
    
class Checkin(webapp.RequestHandler):
  def get(self):
    self.response.out.write('<html><body>')
    
    logging.info('venueid param: %s' % self.request)
    
    if 'venueid' in self.request.arguments():
      fs = get_fs_from_account()
      #checkin = fs.checkin(vid = self.request.get('venueid'), shout = "Me and my army are here.  Get FS Battle to challenge me.")
      checkin = fs.checkin(vid = self.request.get('venueid'), shout = "testing my app, pardon the spam.")['checkin']
      # use the return from checkin to generate treasure.  for now, I'm just going to fudge it.
      self.response.out.write("full dump: %s<br/><br/>Mayor status: %s <br/> First score: <br/>" % (checkin, checkin['mayor']['type']))
      
      player = get_player()
      gold = 0
      
      if 'scoring' in checkin:
        for score in checkin['scoring']:
          gold += int((score['points'] + random.randint(1,10)) * (player.level ^ 1.2))
      
      else:
        self.response.out.write("no fs score.  ")
        gold += int(random.randint(1,10) * (player.level ** 1.2))
        
      self.response.out.write("You got %i gold for checking in here. </br>" % gold)
      
      
      #from the api docs:
      #A mayor block will be returned if there's any mayor information for this place. It'll include a node type which has the following values: new (the user has been appointed mayorship), nochange (the previous mayorship is still valid), stolen (the user stole mayorship from the previous mayor).
      # 
      
      vdetail = fs.venue(vid = self.request.get('venueid'))
      venue = vdetail['venue']
      
      #self.response.out.write("venue detail for this place: %s </br></br>" % venue)
      
      
      self.response.out.write("<h1>These people are here right now:</h1>")
      
      #get the people checked in
      for person in venue['checkins']:
        
        user = person['user']
        
        self.response.out.write("<img src = %s> %s " % (user['photo'],  user['firstname']))
        if 'lastname' in user:
          self.response.out.write("%s" % user['lastname'])
        
        #check their relationship. 3 options 
        # 1 - full friend, fs and fsb'
        # 2 - fs friend - invite to fsb
        # 3 - non friend - invite to both? just fsb would be better, but maybe not possible.  for now, no link.
        
        self.response.out.write("</br>")
        
    else:
      self.redirect('/venues')
      
class Battle(webapp.RequestHandler):
  def get(self):
    self.response.out.write('<html><body>')
  
      
class Member(webapp.RequestHandler):
    def get(self):
		user = gaeusers.get_current_user()

class Authorize(MyRequestHandler):
  """This page is used to do the oauth dance.  It gets an app token
  from foursquare, saves it in the session, then redirects to the
  foursquare authorization page.  That authorization page then
  redirects to /oauth_callback.
  """
  def get(self):
    return self.run()

  def post(self):
    return self.run()
  
  def run(self):
    session = gmemsess.Session(self)
    fs = get_foursquare(session)
    app_token = fs.request_token()
    auth_url = fs.authorize(app_token)
    session['app_token'] = app_token.to_string()
    session.save()
    self.redirect(auth_url)
	
class OAuthCallback(MyRequestHandler):
  """This is our oauth callback, which the foursquare authorization
  page will redirect to.  It gets the user token from foursquare,
  saves it in the session, and redirects to the main page.
  """
  def get(self):
    session = gmemsess.Session(self)
    fs = get_foursquare(session)
    app_token = oauth.OAuthToken.from_string(session['app_token'])
    user_token = fs.access_token(app_token)
    session['user_token'] = user_token.to_string()

    fs.credentials.set_access_token(user_token)
    user = fs.user()['user']
    uid = user['id']
    session['uid'] = uid

    # Make sure this user is in our DB and we save his most up-to-date
    # name and photo.
    player_record = get_player()
    if not player_record:
      player_record = make_player_record(user['firstname'], user['photo'])
      pkey = player_record.put()
      Foursquare(token = fs.credentials.get_access_token().to_string(), pkey=pkey, fsid=uid).put()
    else:
      player_record.name = user['firstname']
      player_record.picture = user['photo']
      player_record.put()
    
    session.save()
    self.redirect('/?uid=%s' % (uid,))
	
class Logout(MyRequestHandler):
  def get(self):
    session = gmemsess.Session(self)
    session.invalidate()
    self.redirect('/')
	
def get_entire_history(fs):
  history = []
  logging.info('Getting all checkins for user')
  for h in foursquare.history_generator(fs):
    # Annoying that Foursquare uses null/None to indicate zero
    # checkins.
    logging.info('  Getting more checkins...')
    if h['checkins']:
      history += h['checkins']
  return history
  
def safer_eval(s):
  return eval(s, {'__builtins__': None}, {})

def get_foursquare(session):
  """Returns an instance of the foursquare API initialized with our
  oauth info.
  """
  oauth_consumer_key = get_key('foursquare-oauth-consumer-key', secret=True)
  oauth_consumer_secret = get_key('foursquare-oauth-consumer-secret', secret=True)
  fs = foursquare.Foursquare(foursquare.OAuthCredentials(oauth_consumer_key, oauth_consumer_secret))
  if 'user_token' in session:
    user_token = oauth.OAuthToken.from_string(session['user_token'])
    fs.credentials.set_access_token(user_token)
  return fs

def get_fs_from_account():
  oauth_consumer_key = get_key('foursquare-oauth-consumer-key', secret=True)
  oauth_consumer_secret = get_key('foursquare-oauth-consumer-secret', secret=True)
  fs = foursquare.Foursquare(foursquare.OAuthCredentials(oauth_consumer_key, oauth_consumer_secret))
  
  fs_record = get_fs()
  token = oauth.OAuthToken.from_string(fs_record.token)
  fs.credentials.set_access_token(token)
  
  return fs
  

  
application = webapp.WSGIApplication([('/authorize', Authorize),
                                      ('/login', Login),
                                      ('/oauth_callback', OAuthCallback),
                                      ('/logout', Logout),
                                      ('/', Login),
                                      ('/venues', Venues),
                                      ('/member', Member),
                                      ('/checkin', Checkin),
                                      ('/equip', EquipData),
									  ('/import', Import)],
                                     debug = True
                                     )
									 
def main():
  run_wsgi_app(application)


def profile_main():
    # This is the main function for profiling
    # We've renamed our original main() above to real_main()
    import cProfile, pstats
    prof = cProfile.Profile()
    prof = prof.runctx("real_main()", globals(), locals())
    print "<pre>"
    stats = pstats.Stats(prof)
    stats.sort_stats("time")  # Or cumulative
    stats.print_stats(80)  # 80 = how many to print
    # The rest is optional.
    # stats.print_callees()
    # stats.print_callers()
    print "</pre>"


#main = real_main
    
#if __name__ == "__main__":
#  main()
  
# def generate_treasure

# def battle(attacker, defender)
# battle constructor?
# given attacker, defender, determine the victor, and generate rewards

# check battle type
#if type is turnbased, or sequential:
# battle.next_round() #this is recursive?
# on return, battle.generate_treasure()                                                                                                                                                                                                                                                                            
# else
# send challenge - TODO


#def battle.next_round()
# iterate through the orders, comparing results, and adjusting stats as it goes
# for each order in attacker.orders
# compare stat1, stat2, stat3
# fight.rounds++
# if fight.rounds>max_rounds, break
# else 
# fight.next_round()
