/*
 * Cartographer.js
 *
 * Distributed under the MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Created by Chris Mueller 
 * http://cartographer.visualmotive.com
 *
 */

var Cartographer = window.Cartographer = (function() { 

/* functions/variables available throughout the namespace */

var cg = function( map, options ) { 
	return new cg.Map( map, options );
}

cg.mapCounter = 0;

cg.log = function( msg ) {
	if( window.console ) { 
		console.log( msg );
	}
};

cg.callable = function( v ) { 
	return typeof(v) == 'function';
};

cg.convert = function( min_in, max_in, min_out, max_out, val ) { 
	val = parseFloat( Math.min( max_in, Math.max( min_in, val ) ) )
	return parseFloat( val - min_in ) / parseFloat( max_in - min_in ) * ( max_out - min_out ) + min_out;
};

cg.parseOptions = function( defaults, inputs ) { 
	if(inputs) { 
		var rtn = {};
		for( validOption in defaults ) {  
			if( inputs.hasOwnProperty( validOption ) ) { 
				rtn[ validOption ] = inputs[ validOption ];
			} else {
				rtn[ validOption ] = defaults[ validOption ];
			}
		}
		return rtn;
	}
	return defaults;
};

/* Inheritance.
 * see http://javascript.crockford.com/prototypal.html
 *
 * To extend an existing object:
 *  // assume class cg.ObjectA is defined
 *  cg.ObjectB = function() { cg.ObjectA.call(this); }
 *  cg.ObjectB.prototype = cg.extend( cg.ObjectA );
 *
 */
cg.extend = function(f) {
	function g() {}
	g.prototype = f.prototype || f;
	return new g();
};

cg.colorSchemes = {"Spectral":[['#fc8d59','#ffffbf','#99d594'],
['#d7191c','#fdae61','#abdda4','#2b83ba'],
['#d7191c','#fdae61','#ffffbf','#abdda4','#2b83ba'],
['#d53e4f','#fc8d59','#fee08b','#e6f598','#99d594','#3288bd'],
['#d53e4f','#fc8d59','#fee08b','#ffffbf','#e6f598','#99d594','#3288bd'],
['#d53e4f','#f46d43','#fdae61','#fee08b','#e6f598','#abdda4','#66c2a5','#3288bd'],
['#d53e4f','#f46d43','#fdae61','#fee08b','#ffffbf','#e6f598','#abdda4','#66c2a5','#3288bd'],
['#9e0142','#d53e4f','#f46d43','#fdae61','#fee08b','#e6f598','#abdda4','#66c2a5','#3288bd','#5e4fa2'],
['#9e0142','#d53e4f','#f46d43','#fdae61','#fee08b','#ffffbf','#e6f598','#abdda4','#66c2a5','#3288bd','#5e4fa2']],
"RdYlGn":[['#fc8d59','#ffffbf','#91cf60'],
['#d7191c','#fdae61','#a6d96a','#1a9641'],
['#d7191c','#fdae61','#ffffbf','#a6d96a','#1a9641'],
['#d73027','#fc8d59','#fee08b','#d9ef8b','#91cf60','#1a9850'],
['#d73027','#fc8d59','#fee08b','#ffffbf','#d9ef8b','#91cf60','#1a9850'],
['#d73027','#f46d43','#fdae61','#fee08b','#d9ef8b','#a6d96a','#66bd63','#1a9850'],
['#d73027','#f46d43','#fdae61','#fee08b','#ffffbf','#d9ef8b','#a6d96a','#66bd63','#1a9850'],
['#a50026','#d73027','#f46d43','#fdae61','#fee08b','#d9ef8b','#a6d96a','#66bd63','#1a9850','#006837'],
['#a50026','#d73027','#f46d43','#fdae61','#fee08b','#ffffbf','#d9ef8b','#a6d96a','#66bd63','#1a9850','#006837']],
"Set2":[['#66c2a5','#fc8d62','#8da0cb'],
['#66c2a5','#fc8d62','#8da0cb','#e78ac3'],
['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854'],
['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f'],
['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f','#e5c494'],
['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f','#e5c494','#b3b3b3']],
"Accent":[['#7fc97f','#beaed4','#fdc086'],
['#7fc97f','#beaed4','#fdc086','#ffff99'],
['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0'],
['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f'],
['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f','#bf5b17'],
['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f','#bf5b17','#666666']],
"OrRd":[['#fee8c8','#fdbb84','#e34a33'],
['#fef0d9','#fdcc8a','#fc8d59','#d7301f'],
['#fef0d9','#fdcc8a','#fc8d59','#e34a33','#b30000'],
['#fef0d9','#fdd49e','#fdbb84','#fc8d59','#e34a33','#b30000'],
['#fef0d9','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#990000'],
['#fff7ec','#fee8c8','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#990000'],
['#fff7ec','#fee8c8','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#b30000','#7f0000']],
"Set1":[['#e41a1c','#377eb8','#4daf4a'],
['#e41a1c','#377eb8','#4daf4a','#984ea3'],
['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00'],
['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33'],
['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628'],
['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf'],
['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999']],
"PuBu":[['#ece7f2','#a6bddb','#2b8cbe'],
['#f1eef6','#bdc9e1','#74a9cf','#0570b0'],
['#f1eef6','#bdc9e1','#74a9cf','#2b8cbe','#045a8d'],
['#f1eef6','#d0d1e6','#a6bddb','#74a9cf','#2b8cbe','#045a8d'],
['#f1eef6','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#034e7b'],
['#fff7fb','#ece7f2','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#034e7b'],
['#fff7fb','#ece7f2','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#045a8d','#023858']],
"Set3":[['#8dd3c7','#ffffb3','#bebada'],
['#8dd3c7','#ffffb3','#bebada','#fb8072'],
['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3'],
['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462'],
['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69'],
['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5'],
['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9'],
['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd'],
['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5'],
['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f']],
"BuPu":[['#e0ecf4','#9ebcda','#8856a7'],
['#edf8fb','#b3cde3','#8c96c6','#88419d'],
['#edf8fb','#b3cde3','#8c96c6','#8856a7','#810f7c'],
['#edf8fb','#bfd3e6','#9ebcda','#8c96c6','#8856a7','#810f7c'],
['#edf8fb','#bfd3e6','#9ebcda','#8c96c6','#8c6bb1','#88419d','#6e016b'],
['#f7fcfd','#e0ecf4','#bfd3e6','#9ebcda','#8c96c6','#8c6bb1','#88419d','#6e016b'],
['#f7fcfd','#e0ecf4','#bfd3e6','#9ebcda','#8c96c6','#8c6bb1','#88419d','#810f7c','#4d004b']],
"Dark2":[['#1b9e77','#d95f02','#7570b3'],
['#1b9e77','#d95f02','#7570b3','#e7298a'],
['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e'],
['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e','#e6ab02'],
['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e','#e6ab02','#a6761d'],
['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e','#e6ab02','#a6761d','#666666']],
"RdBu":[['#ef8a62','#f7f7f7','#67a9cf'],
['#ca0020','#f4a582','#92c5de','#0571b0'],
['#ca0020','#f4a582','#f7f7f7','#92c5de','#0571b0'],
['#b2182b','#ef8a62','#fddbc7','#d1e5f0','#67a9cf','#2166ac'],
['#b2182b','#ef8a62','#fddbc7','#f7f7f7','#d1e5f0','#67a9cf','#2166ac'],
['#b2182b','#d6604d','#f4a582','#fddbc7','#d1e5f0','#92c5de','#4393c3','#2166ac'],
['#b2182b','#d6604d','#f4a582','#fddbc7','#f7f7f7','#d1e5f0','#92c5de','#4393c3','#2166ac'],
['#67001f','#b2182b','#d6604d','#f4a582','#fddbc7','#d1e5f0','#92c5de','#4393c3','#2166ac','#053061'],
['#67001f','#b2182b','#d6604d','#f4a582','#fddbc7','#f7f7f7','#d1e5f0','#92c5de','#4393c3','#2166ac','#053061']],
"Oranges":[['#fee6ce','#fdae6b','#e6550d'],
['#feedde','#fdbe85','#fd8d3c','#d94701'],
['#feedde','#fdbe85','#fd8d3c','#e6550d','#a63603'],
['#feedde','#fdd0a2','#fdae6b','#fd8d3c','#e6550d','#a63603'],
['#feedde','#fdd0a2','#fdae6b','#fd8d3c','#f16913','#d94801','#8c2d04'],
['#fff5eb','#fee6ce','#fdd0a2','#fdae6b','#fd8d3c','#f16913','#d94801','#8c2d04'],
['#fff5eb','#fee6ce','#fdd0a2','#fdae6b','#fd8d3c','#f16913','#d94801','#a63603','#7f2704']],
"BuGn":[['#e5f5f9','#99d8c9','#2ca25f'],
['#edf8fb','#b2e2e2','#66c2a4','#238b45'],
['#edf8fb','#b2e2e2','#66c2a4','#2ca25f','#006d2c'],
['#edf8fb','#ccece6','#99d8c9','#66c2a4','#2ca25f','#006d2c'],
['#edf8fb','#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#005824'],
['#f7fcfd','#e5f5f9','#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#005824'],
['#f7fcfd','#e5f5f9','#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#006d2c','#00441b']],
"PiYG":[['#e9a3c9','#f7f7f7','#a1d76a'],
['#d01c8b','#f1b6da','#b8e186','#4dac26'],
['#d01c8b','#f1b6da','#f7f7f7','#b8e186','#4dac26'],
['#c51b7d','#e9a3c9','#fde0ef','#e6f5d0','#a1d76a','#4d9221'],
['#c51b7d','#e9a3c9','#fde0ef','#f7f7f7','#e6f5d0','#a1d76a','#4d9221'],
['#c51b7d','#de77ae','#f1b6da','#fde0ef','#e6f5d0','#b8e186','#7fbc41','#4d9221'],
['#c51b7d','#de77ae','#f1b6da','#fde0ef','#f7f7f7','#e6f5d0','#b8e186','#7fbc41','#4d9221'],
['#8e0152','#c51b7d','#de77ae','#f1b6da','#fde0ef','#e6f5d0','#b8e186','#7fbc41','#4d9221','#276419'],
['#8e0152','#c51b7d','#de77ae','#f1b6da','#fde0ef','#f7f7f7','#e6f5d0','#b8e186','#7fbc41','#4d9221','#276419']],
"YlOrBr":[['#fff7bc','#fec44f','#d95f0e'],
['#ffffd4','#fed98e','#fe9929','#cc4c02'],
['#ffffd4','#fed98e','#fe9929','#d95f0e','#993404'],
['#ffffd4','#fee391','#fec44f','#fe9929','#d95f0e','#993404'],
['#ffffd4','#fee391','#fec44f','#fe9929','#ec7014','#cc4c02','#8c2d04'],
['#ffffe5','#fff7bc','#fee391','#fec44f','#fe9929','#ec7014','#cc4c02','#8c2d04'],
['#ffffe5','#fff7bc','#fee391','#fec44f','#fe9929','#ec7014','#cc4c02','#993404','#662506']],
"YlGn":[['#f7fcb9','#addd8e','#31a354'],
['#ffffcc','#c2e699','#78c679','#238443'],
['#ffffcc','#c2e699','#78c679','#31a354','#006837'],
['#ffffcc','#d9f0a3','#addd8e','#78c679','#31a354','#006837'],
['#ffffcc','#d9f0a3','#addd8e','#78c679','#41ab5d','#238443','#005a32'],
['#ffffe5','#f7fcb9','#d9f0a3','#addd8e','#78c679','#41ab5d','#238443','#005a32'],
['#ffffe5','#f7fcb9','#d9f0a3','#addd8e','#78c679','#41ab5d','#238443','#006837','#004529']],
"Reds":[['#fee0d2','#fc9272','#de2d26'],
['#fee5d9','#fcae91','#fb6a4a','#cb181d'],
['#fee5d9','#fcae91','#fb6a4a','#de2d26','#a50f15'],
['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#de2d26','#a50f15'],
['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#ef3b2c','#cb181d','#99000d'],
['#fff5f0','#fee0d2','#fcbba1','#fc9272','#fb6a4a','#ef3b2c','#cb181d','#99000d'],
['#fff5f0','#fee0d2','#fcbba1','#fc9272','#fb6a4a','#ef3b2c','#cb181d','#a50f15','#67000d']],
"RdPu":[['#fde0dd','#fa9fb5','#c51b8a'],
['#feebe2','#fbb4b9','#f768a1','#ae017e'],
['#feebe2','#fbb4b9','#f768a1','#c51b8a','#7a0177'],
['#feebe2','#fcc5c0','#fa9fb5','#f768a1','#c51b8a','#7a0177'],
['#feebe2','#fcc5c0','#fa9fb5','#f768a1','#dd3497','#ae017e','#7a0177'],
['#fff7f3','#fde0dd','#fcc5c0','#fa9fb5','#f768a1','#dd3497','#ae017e','#7a0177'],
['#fff7f3','#fde0dd','#fcc5c0','#fa9fb5','#f768a1','#dd3497','#ae017e','#7a0177','#49006a']],
"Greens":[['#e5f5e0','#a1d99b','#31a354'],
['#edf8e9','#bae4b3','#74c476','#238b45'],
['#edf8e9','#bae4b3','#74c476','#31a354','#006d2c'],
['#edf8e9','#c7e9c0','#a1d99b','#74c476','#31a354','#006d2c'],
['#edf8e9','#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45','#005a32'],
['#f7fcf5','#e5f5e0','#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45','#005a32'],
['#f7fcf5','#e5f5e0','#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45','#006d2c','#00441b']],
"PRGn":[['#af8dc3','#f7f7f7','#7fbf7b'],
['#7b3294','#c2a5cf','#a6dba0','#008837'],
['#7b3294','#c2a5cf','#f7f7f7','#a6dba0','#008837'],
['#762a83','#af8dc3','#e7d4e8','#d9f0d3','#7fbf7b','#1b7837'],
['#762a83','#af8dc3','#e7d4e8','#f7f7f7','#d9f0d3','#7fbf7b','#1b7837'],
['#762a83','#9970ab','#c2a5cf','#e7d4e8','#d9f0d3','#a6dba0','#5aae61','#1b7837'],
['#762a83','#9970ab','#c2a5cf','#e7d4e8','#f7f7f7','#d9f0d3','#a6dba0','#5aae61','#1b7837'],
['#40004b','#762a83','#9970ab','#c2a5cf','#e7d4e8','#d9f0d3','#a6dba0','#5aae61','#1b7837','#00441b'],
['#40004b','#762a83','#9970ab','#c2a5cf','#e7d4e8','#f7f7f7','#d9f0d3','#a6dba0','#5aae61','#1b7837','#00441b']],
"YlGnBu":[['#edf8b1','#7fcdbb','#2c7fb8'],
['#ffffcc','#a1dab4','#41b6c4','#225ea8'],
['#ffffcc','#a1dab4','#41b6c4','#2c7fb8','#253494'],
['#ffffcc','#c7e9b4','#7fcdbb','#41b6c4','#2c7fb8','#253494'],
['#ffffcc','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#0c2c84'],
['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#0c2c84'],
['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58']],
"RdYlBu":[['#fc8d59','#ffffbf','#91bfdb'],
['#d7191c','#fdae61','#abd9e9','#2c7bb6'],
['#d7191c','#fdae61','#ffffbf','#abd9e9','#2c7bb6'],
['#d73027','#fc8d59','#fee090','#e0f3f8','#91bfdb','#4575b4'],
['#d73027','#fc8d59','#fee090','#ffffbf','#e0f3f8','#91bfdb','#4575b4'],
['#d73027','#f46d43','#fdae61','#fee090','#e0f3f8','#abd9e9','#74add1','#4575b4'],
['#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4'],
['#a50026','#d73027','#f46d43','#fdae61','#fee090','#e0f3f8','#abd9e9','#74add1','#4575b4','#313695'],
['#a50026','#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4','#313695']],
"Paired":[['#a6cee3','#1f78b4','#b2df8a'],
['#a6cee3','#1f78b4','#b2df8a','#33a02c'],
['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99'],
['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c'],
['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f'],
['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00'],
['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6'],
['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'],
['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99'],
['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928']],
"BrBG":[['#d8b365','#f5f5f5','#5ab4ac'],
['#a6611a','#dfc27d','#80cdc1','#018571'],
['#a6611a','#dfc27d','#f5f5f5','#80cdc1','#018571'],
['#8c510a','#d8b365','#f6e8c3','#c7eae5','#5ab4ac','#01665e'],
['#8c510a','#d8b365','#f6e8c3','#f5f5f5','#c7eae5','#5ab4ac','#01665e'],
['#8c510a','#bf812d','#dfc27d','#f6e8c3','#c7eae5','#80cdc1','#35978f','#01665e'],
['#8c510a','#bf812d','#dfc27d','#f6e8c3','#f5f5f5','#c7eae5','#80cdc1','#35978f','#01665e'],
['#543005','#8c510a','#bf812d','#dfc27d','#f6e8c3','#c7eae5','#80cdc1','#35978f','#01665e','#003c30'],
['#543005','#8c510a','#bf812d','#dfc27d','#f6e8c3','#f5f5f5','#c7eae5','#80cdc1','#35978f','#01665e','#003c30']],
"Purples":[['#efedf5','#bcbddc','#756bb1'],
['#f2f0f7','#cbc9e2','#9e9ac8','#6a51a3'],
['#f2f0f7','#cbc9e2','#9e9ac8','#756bb1','#54278f'],
['#f2f0f7','#dadaeb','#bcbddc','#9e9ac8','#756bb1','#54278f'],
['#f2f0f7','#dadaeb','#bcbddc','#9e9ac8','#807dba','#6a51a3','#4a1486'],
['#fcfbfd','#efedf5','#dadaeb','#bcbddc','#9e9ac8','#807dba','#6a51a3','#4a1486'],
['#fcfbfd','#efedf5','#dadaeb','#bcbddc','#9e9ac8','#807dba','#6a51a3','#54278f','#3f007d']],
"Pastel2":[['#b3e2cd','#fdcdac','#cbd5e8'],
['#b3e2cd','#fdcdac','#cbd5e8','#f4cae4'],
['#b3e2cd','#fdcdac','#cbd5e8','#f4cae4','#e6f5c9'],
['#b3e2cd','#fdcdac','#cbd5e8','#f4cae4','#e6f5c9','#fff2ae'],
['#b3e2cd','#fdcdac','#cbd5e8','#f4cae4','#e6f5c9','#fff2ae','#f1e2cc'],
['#b3e2cd','#fdcdac','#cbd5e8','#f4cae4','#e6f5c9','#fff2ae','#f1e2cc','#cccccc']],
"Pastel1":[['#fbb4ae','#b3cde3','#ccebc5'],
['#fbb4ae','#b3cde3','#ccebc5','#decbe4'],
['#fbb4ae','#b3cde3','#ccebc5','#decbe4','#fed9a6'],
['#fbb4ae','#b3cde3','#ccebc5','#decbe4','#fed9a6','#ffffcc'],
['#fbb4ae','#b3cde3','#ccebc5','#decbe4','#fed9a6','#ffffcc','#e5d8bd'],
['#fbb4ae','#b3cde3','#ccebc5','#decbe4','#fed9a6','#ffffcc','#e5d8bd','#fddaec'],
['#fbb4ae','#b3cde3','#ccebc5','#decbe4','#fed9a6','#ffffcc','#e5d8bd','#fddaec','#f2f2f2']],
"GnBu":[['#e0f3db','#a8ddb5','#43a2ca'],
['#f0f9e8','#bae4bc','#7bccc4','#2b8cbe'],
['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac'],
['#f0f9e8','#ccebc5','#a8ddb5','#7bccc4','#43a2ca','#0868ac'],
['#f0f9e8','#ccebc5','#a8ddb5','#7bccc4','#4eb3d3','#2b8cbe','#08589e'],
['#f7fcf0','#e0f3db','#ccebc5','#a8ddb5','#7bccc4','#4eb3d3','#2b8cbe','#08589e'],
['#f7fcf0','#e0f3db','#ccebc5','#a8ddb5','#7bccc4','#4eb3d3','#2b8cbe','#0868ac','#084081']],
"Greys":[['#f0f0f0','#bdbdbd','#636363'],
['#f7f7f7','#cccccc','#969696','#525252'],
['#f7f7f7','#cccccc','#969696','#636363','#252525'],
['#f7f7f7','#d9d9d9','#bdbdbd','#969696','#636363','#252525'],
['#f7f7f7','#d9d9d9','#bdbdbd','#969696','#737373','#525252','#252525'],
['#ffffff','#f0f0f0','#d9d9d9','#bdbdbd','#969696','#737373','#525252','#252525'],
['#ffffff','#f0f0f0','#d9d9d9','#bdbdbd','#969696','#737373','#525252','#252525','#000000']],
"RdGy":[['#ef8a62','#ffffff','#999999'],
['#ca0020','#f4a582','#bababa','#404040'],
['#ca0020','#f4a582','#ffffff','#bababa','#404040'],
['#b2182b','#ef8a62','#fddbc7','#e0e0e0','#999999','#4d4d4d'],
['#b2182b','#ef8a62','#fddbc7','#ffffff','#e0e0e0','#999999','#4d4d4d'],
['#b2182b','#d6604d','#f4a582','#fddbc7','#e0e0e0','#bababa','#878787','#4d4d4d'],
['#b2182b','#d6604d','#f4a582','#fddbc7','#ffffff','#e0e0e0','#bababa','#878787','#4d4d4d'],
['#67001f','#b2182b','#d6604d','#f4a582','#fddbc7','#e0e0e0','#bababa','#878787','#4d4d4d','#1a1a1a'],
['#67001f','#b2182b','#d6604d','#f4a582','#fddbc7','#ffffff','#e0e0e0','#bababa','#878787','#4d4d4d','#1a1a1a']],
"YlOrRd":[['#ffeda0','#feb24c','#f03b20'],
['#ffffb2','#fecc5c','#fd8d3c','#e31a1c'],
['#ffffb2','#fecc5c','#fd8d3c','#f03b20','#bd0026'],
['#ffffb2','#fed976','#feb24c','#fd8d3c','#f03b20','#bd0026'],
['#ffffb2','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026'],
['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026'],
['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026']],
"PuOr":[['#f1a340','#f7f7f7','#998ec3'],
['#e66101','#fdb863','#b2abd2','#5e3c99'],
['#e66101','#fdb863','#f7f7f7','#b2abd2','#5e3c99'],
['#b35806','#f1a340','#fee0b6','#d8daeb','#998ec3','#542788'],
['#b35806','#f1a340','#fee0b6','#f7f7f7','#d8daeb','#998ec3','#542788'],
['#b35806','#e08214','#fdb863','#fee0b6','#d8daeb','#b2abd2','#8073ac','#542788'],
['#b35806','#e08214','#fdb863','#fee0b6','#f7f7f7','#d8daeb','#b2abd2','#8073ac','#542788'],
['#7f3b08','#b35806','#e08214','#fdb863','#fee0b6','#d8daeb','#b2abd2','#8073ac','#542788','#2d004b'],
['#7f3b08','#b35806','#e08214','#fdb863','#fee0b6','#f7f7f7','#d8daeb','#b2abd2','#8073ac','#542788','#2d004b']],
"PuRd":[['#e7e1ef','#c994c7','#dd1c77'],
['#f1eef6','#d7b5d8','#df65b0','#ce1256'],
['#f1eef6','#d7b5d8','#df65b0','#dd1c77','#980043'],
['#f1eef6','#d4b9da','#c994c7','#df65b0','#dd1c77','#980043'],
['#f1eef6','#d4b9da','#c994c7','#df65b0','#e7298a','#ce1256','#91003f'],
['#f7f4f9','#e7e1ef','#d4b9da','#c994c7','#df65b0','#e7298a','#ce1256','#91003f'],
['#f7f4f9','#e7e1ef','#d4b9da','#c994c7','#df65b0','#e7298a','#ce1256','#980043','#67001f']],
"Blues":[['#deebf7','#9ecae1','#3182bd'],
['#eff3ff','#bdd7e7','#6baed6','#2171b5'],
['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'],
['#eff3ff','#c6dbef','#9ecae1','#6baed6','#3182bd','#08519c'],
['#eff3ff','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#084594'],
['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#084594'],
['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b']],
"PuBuGn":[['#ece2f0','#a6bddb','#1c9099'],
['#f6eff7','#bdc9e1','#67a9cf','#02818a'],
['#f6eff7','#bdc9e1','#67a9cf','#1c9099','#016c59'],
['#f6eff7','#d0d1e6','#a6bddb','#67a9cf','#1c9099','#016c59'],
['#f6eff7','#d0d1e6','#a6bddb','#67a9cf','#3690c0','#02818a','#016450'],
['#fff7fb','#ece2f0','#d0d1e6','#a6bddb','#67a9cf','#3690c0','#02818a','#016450'],
['#fff7fb','#ece2f0','#d0d1e6','#a6bddb','#67a9cf','#3690c0','#02818a','#016c59','#014636']]};
cg.Map = function( map, options ) {
	this.id = cg.mapCounter++,
	this.bbox = null;
	this.handlers = [];

	this.map = map;
	this.opts = cg.parseOptions( this.defaults, options ),

	// TODO: detect this dynamically, support for other map types
	this.maptype = "GMap2";

	this.init();
}

cg.Map.prototype.defaults = { 
	"colorize": "#ffffff", 
	"colorizeAlpha": 0.5,
	"autoZoom": true
};


cg.Map.prototype.init = function() { 
	var m = this;
	m.applyFilters();
	GEvent.addListener( m.map, "zoomend", function( oldLevel, newLevel ) {
		for( var i = 0, ii = m.handlers.length; i < ii; i++ ) { 
			if( m.handlers[i].zoomend && cg.callable( m.handlers[i].zoomend ) ) { 
				m.handlers[i].zoomend( oldLevel, newLevel ); 
			}
		}
	});
	GEvent.addListener( m.map, "moveend", function() {
		for( var i = 0, ii = m.handlers.length; i < ii; i++ ) { 
			if( m.handlers[i].moveend && cg.callable( m.handlers[i].moveend ) ) { 
				m.handlers[i].moveend(); 
			}
		}
	});
	GEvent.addListener( m.map, "maptypechanged", function() {
		for( var i = 0, ii = m.handlers.length; i < ii; i++ ) { 
			if( m.handlers[i].maptypechanged && cg.callable( m.handlers[i].maptypechanged ) ) { 
				m.handlers[i].maptypechanged(); 
			}
		}
	});
};

cg.Map.prototype.applyFilters = function() { 
	// only filter now is colorize
	if(!this.opts.colorize) return;

	var rects = [new GPolygon([new GLatLng(-85,0),new GLatLng(85,0),new GLatLng(85,90),new GLatLng(-85,90)],null,0,0,this.opts.colorize,this.opts.colorizeAlpha),
		new GPolygon([new GLatLng(-85,90),new GLatLng(85,90),new GLatLng(85,180),new GLatLng(-85,180)],null,0,0,this.opts.colorize,this.opts.colorizeAlpha),
		new GPolygon([new GLatLng(-85,180.000001),new GLatLng(85,180.000001),new GLatLng(85,270),new GLatLng(-85,270)],null,0,0,this.opts.colorize,this.opts.colorizeAlpha),
		new GPolygon([new GLatLng(-85,270),new GLatLng(85,270),new GLatLng(85,360),new GLatLng(-85,360)],null,0,0,this.opts.colorize,this.opts.colorizeAlpha)]
	for(var i = 0; i < rects.length; i++ ) { 
		this.map.addOverlay( rects[i] );
	}
};

cg.Map.prototype.registerHandler = function( obj ) { 
	this.handlers.push( obj );

	// zoom to the bounds of the object
	if( this.opts.autoZoom && cg.callable( obj.bounds ) ) { 
		if( !this.bbox ) { 
			this.bbox = obj.bounds();
		} else { 
			this.bbox.extend( obj.bounds().getSouthWest() );
			this.bbox.extend( obj.bounds().getNorthEast() );
		}
		this.map.setCenter( this.bbox.getCenter() );
		this.map.setZoom( this.map.getBoundsZoomLevel( this.bbox ) );
	}

	return obj;
};

/*
 * Shortcut function for making choropleths
 */
cg.Map.prototype.choropleth = function( data, options ) { 
	var options = options || {};
	return this.registerHandler( new cg.Choropleth( this, data, options ) );
};

cg.Map.prototype.chloropleth = cg.Map.prototype.choropleth;

/*
 * shortcut method for creating bubble maps
 */
cg.Map.prototype.bubble = function( data, options ) { 
	var options = options || {};
	return this.registerHandler( new cg.Bubble( this, data, options ) );
};

/*
 * shortcut for clustering/bubble maps
 */
cg.Map.prototype.cluster = function( data, options ) { 
	var options = options || {};
	options['cluster'] = true;
	return this.registerHandler( new cg.Bubble( this, data, options ) );
};

/*
 * shortcut for pie charts
 */
cg.Map.prototype.pie = function( lat, lng, radius, data, options ) { 
	return this.registerHandler( new cg.PieChart( this, new GLatLng(lat,lng), radius, data, options ) );
};

cg.Map.prototype.pies = function( ls, options ) { 
	var options = options || {};
	// ls is a list of [ lat, lng, data ] arrays.
	var defaults = { 
		"colorScheme": "Spectral",
		"colors": [],
		"reverseColors": false,
		"stroke": "#000",
		"labels": [],
		"opacity": .8
	},
	opts = cg.parseOptions( defaults, options ),
	maxsegments = 0;
			
	// Determine the pie with the most segments, 
	//  and verify its color scheme has enough colors.
	for( var i = 0; i < ls.length; i++ ) { 
		maxsegments = Math.max( maxsegments, ls[i][3].length );
	}
			
	// If the user didn't specify their own colors, 
	//  we'll pull an array of colors from the color scheme.
	if( true || !opts.colors || opts.colors.length == 0 ) { 
		opts.colors = cg.colorSchemes[ opts.colorScheme ][ Math.min( maxsegments-1, cg.colorSchemes[opts.colorScheme].length-1 ) ];
		if( opts.reverseColors ) { 
			var c = [];
			for( var i = opts.colors.length - 1; i > 0; i-- ) { 
				c.push( opts.colors[i] );
			}
			opts.colors = c;
		}
	} 
	
	for( var i = 0, ii = ls.length; i < ii; i++ ) { 
		this.pie( ls[i][0], ls[i][1], ls[i][2], ls[i][3], opts );
	}
};

cg.ThematicLayer = function( parent, data ) {
	this.parent = parent;
	this.map = parent.map;
	this.data = data;
	this.bbox = null;
}


cg.ThematicLayer.prototype.bounds = function() { 
	return this.bbox;
}

cg.ThematicLayer.prototype.zoomend = function( oldlevel, newlevel ) { 
	return;
}

cg.ThematicLayer.prototype.moveend = function() { 
	return;
}

cg.ThematicLayer.prototype.maptypechanged = function() { 
	return;
}

cg.ThematicLayer.prototype.render = function() { 
	return;
}


/*
 * Little class for helping with the Cluster grids
 */
cg.ClusterGridCell = function( parent ) { 
	this.parent = parent;
	this.val = 0;
	this.items = [];
	this.rendered = false;
	this.lat = 0;
	this.lng = 0;
};

cg.ClusterGridCell.prototype.push = function( val, item, lat, lng ) {
	if( this.parent.opts.average && this.parent.opts.enableDots ) { 
		this.lat = ((this.lat * this.val) + ( lat * val )) / ( val + this.val );
		this.lng = ((this.lng * this.val) + ( lng * val )) / ( val + this.val );
	}
	this.val = this.parent.opts.combine( this.val, val );
	this.items.push( item );
};


/*
 * Bubble maps also known as proportional-symbol maps.
 * Supports grid-based clustering to group data points into dynamically-sized symbols.
 * 
 * @parent the parent Cartographer.Map object
 *
 */
cg.Bubble = function( parent, data, options ) { 
	var options = options || {};
	cg.ThematicLayer.call( this, parent, data );
	this.opts = cg.parseOptions( this.defaults, options );

	this.overlays = [];
	this.currMax = 0;
	this.convertedMax = 0; 
	this.gridsize = 20; // dynamically scaled based on the current zoom level of the map
	this.grid = [[]]; // lats then lngs, 2d array

	this.latMin = null;
	this.latMax = null;
	this.lngMin = null;
	this.lngMax = null;
	this.gridLatMin = null;
	this.gridLatMax = null;
	this.gridLngMin = null;
	this.gridLngMax = null;

	// we don't redraw if the map hasn't
	// actually moved even when a move event is fired
	this.lastMapBounds = null;

	this.init();
}

cg.Bubble.prototype = cg.extend( cg.ThematicLayer );


cg.Bubble.prototype.defaults = { 
	"enableDots": true,
	"enableGrid": false,
	"combine": function(a,b) { return a + b; },
			
	// colors for dots
	"color": "#fc8d59",
	"stroke": "#000",
	"colorHover": "#ffffbf",
	"colorActive": "#ffffbf",
	"opacity":0.8,
			
	// grid
	"gridColor":"#5e4fa2",
	"gridSize": 24.0,

	// whether or not to average location of grid circle
	// TODO support other clustering strategies
	"average": true, 

	// how to display data in popups,
	"popup": "all", // or "reduce" [DEPRECATED]
	"popupLabel": "Value:", // for "reduce" [DEPRECATED]
	"balloon": function( obj ) { return obj.parent.createDefaultBalloon(obj) } // func with one arg, the data-cell

};

cg.Bubble.prototype.init = function() { 
	var zoom = this.map.getZoom();
	this.buildGrid( zoom );

	// the render() method will be called by this.placeGroups()
	this.placeGroups();
};

cg.Bubble.prototype.boundsToGrid = function( zoomlevel ) { 
	var sw = this.map.getBounds().getSouthWest();
	var ne = this.map.getBounds().getNorthEast();
	var sw_snap = this.snapToGrid( sw.lat(), sw.lng() );
	var ne_snap = this.snapToGrid( ne.lat(), ne.lng() );
	this.latMax = ne.lat();
	this.latMin = sw.lat();
	this.lngMax = ne.lng();
	this.lngMin = sw.lng();
	this.gridLatMax = ne_snap[0] + (2 * this.gridsize);
	this.gridLatMin = sw_snap[0];
	this.gridLngMax = ne_snap[1] + (2 * this.gridsize);
	this.gridLngMin = sw_snap[1];
};

cg.Bubble.prototype.buildGrid = function( zoom ) { 
	var b = this;
	this.grid = [];
	this.gridsize = this.opts.gridSize / Math.pow( 2, zoom ); 
	this.boundsToGrid();
	this.loopGrid( 
		function( i, j ) { 
			b.grid[ i ][ j ] = new cg.ClusterGridCell( b ); 
		}, 
		function( i ) { 
			b.grid[ i ] = []; 
		}); 
};

cg.Bubble.prototype.clearMarkers = function() { 
	for( var i = 0; i < this.overlays.length; i++ ) {
		try { 
			this.map.removeOverlay( this.overlays[ i ] );
		} catch( e ) { 
			cg.log( "Error: cg.Bubble.prototype.clearMarkers() " + e );
		}
	}
	this.overlays = [];
};

cg.Bubble.prototype.createDefaultBalloon = function( cell ) {
	// creates a balloon with HTML for multiple items
	var rtn = "<div class='cartographer-balloon' style='height:100px;max-height:100px;overflow:auto;'>";
	var item = null;
	if( this.opts.popup == "all" ) { // for legacy code; DEPRECATED 
		rtn += "<ol>";
		for( var i = 0; i < cell.items.length; i++ ) { 
			rtn += "<li>";
			item = cell.items[i];
			if( item.label ) { 
				rtn += item.label + ": ";	
			} 
			rtn += item.val;
			rtn += "</li>";
		}
		rtn += "</ol>";
	} else { // for legacy code; DEPRECATED
		rtn += this.opts.popupLabel + " " + cell.val;
	}
	return rtn + "</div>";
};

cg.Bubble.prototype.createMarker = function( point, val, label ) { 
	var convertedVal = Math.sqrt( (1+val) * 100.0 / Math.PI );
	convertedVal = cg.convert( 1, this.convertedMax, 2, this.opts.gridSize * .5, convertedVal );
	var marker = new Shape( point, convertedVal, { 
		"infoWindow": label, 
		"color": this.opts.color, 
		"stroke": this.opts.stroke, 
		"colorHover": this.opts.colorHover, 
		"colorActive": this.opts.colorActive, 
		"opacity": this.opts.opacity,
		"zIndexProcess": function() { return 10 + this.currMax - val; }
	});
	return marker;
};

cg.Bubble.prototype.createRect = function( sw, ne, val ) { 
	var gborder = [];
	var nw = new GLatLng( ne.lat(), sw.lng() );
	var se = new GLatLng( sw.lat(), ne.lng() );
	gborder.push( se );
	gborder.push( sw );
	gborder.push( nw );
	gborder.push( ne );
	gborder.push( se );
	var color = this.opts.gridColor; 
	var polygon = new GPolygon( gborder, color, 1, .3, color, Math.max( .1, Math.min( val * .1, .70 ) ) );
	return polygon;
};

cg.Bubble.prototype.loopGrid = function( cellFn, rowFn ) {
	var idl = ( this.lngMax < this.lngMin );
	var idlLngMax = this.snapToGrid( 0, 180 )[ 1 ]; 
	var idlLngMin = this.snapToGrid( 0, -180 )[ 1 ]; 
	if( !idl ) {
		for( var i = this.gridLatMin; i < this.gridLatMax; i++ ) {
			if( rowFn ) { 
				rowFn( i ); 
			}
			for( var j = this.gridLngMin; j < this.gridLngMax; j++ ) {
				cellFn( i, j );
			}
		}
	} else {
		// International Date Line foo
		for( var i = this.gridLatMin; i < this.gridLatMax; i++ ) {
			if( rowFn ) { 
				rowFn( i ); 
			}
			for( var j = idlLngMin; j < this.gridLngMax; j++ ) {
				cellFn( i, j );
			}
			for( var k = this.gridLngMin; k < this.idlLngMax; k++ ) {
				cellFn( i, k );
			}
		}
	}
};

cg.Bubble.prototype.placeGroups = function() { 
	var forceDirty = false;
	var lastCycleMax = this.currMax;
	for( var k = 0; k < this.data.length; k++ ) {
		var lat = this.data[ k ].lat;
		var lng = this.data[ k ].lng;
		if( !( this.latMin <= lat && this.latMax >= lat && 
		       ( ( this.lngMin <= lng && this.lngMax >= lng ) 
		         // check for wrap on International Date Line
		         || ( this.lngMin > this.lngMax && ( ( this.lngMin <= lng && lng <= 180 ) || ( this.lngMax >= lng && lng > -180 ) ) ) 
			  ) 
			) 
		  ) 
		{
			continue;
		} 
		try {
			// only place the item if that grid cell hasn't been rendered
			var snap = this.snapToGrid( lat, lng );
			if( !this.grid[ snap[0] ][ snap[1] ].rendered ) {  // "rendered" flag
				this.grid[ snap[0] ][ snap[1] ].push( 
					this.data[k].val, this.data[k], this.data[k].lat, this.data[k].lng 
				);
				this.currMax = Math.max( this.grid[ snap[0] ][ snap[1] ].val, this.currMax );
			}
		}
		catch( e ) { cg.log( "Snap error at " + snap + " Error:" + e ); }
	}

	// for items that are dynamically scaled... 
	if( lastCycleMax < this.currMax ) { 
		this.buildGrid( this.map.getZoom() );
		if( this.placeGroups() ) {
			this.render( true );
		}
		return false;
	}
	return true;
};

cg.Bubble.prototype.render = function( clear ) {
	// only draw if the map bounds have changed
	if(this.lastMapBounds != null && this.lastMapBounds.equals(this.map.getBounds())) { 
		return;	
	}
	this.lastMapBounds = this.map.getBounds();
	var point, val, html, marker, rendered, cell;
	var b = this;
	if( clear ) { 
		b.clearMarkers();
	}
	b.convertedMax = parseInt( Math.sqrt( (1 + b.currMax) * 100.0 / Math.PI ) );

	this.loopGrid( function( i, j ) { 
		cell = b.grid[ i ][ j ];
		rendered = cell.rendered;
		val = cell.val;
		if( val > 0 && ( !rendered || clear ) ) {
			var sw = new GLatLng( i * b.gridsize - 90, j * b.gridsize - 180 );
			var ne = new GLatLng( (i+1) * b.gridsize - 90, (j+1) * b.gridsize - 180 );
			if(!b.bbox) { 
				b.bbox = new GLatLngBounds( sw, ne );
			} else { 
				b.bbox.extend( sw );
				b.bbox.extend( ne );
			}
			if( b.opts.enableDots ) { 
				if( b.opts.average ) { 
					point = new GLatLng( cell.lat, cell.lng );
				} else {
					point = new GLatLng( ( i + .5 ) * b.gridsize - 90, ( j + .5 ) * b.gridsize - 180 );
				}
				html = b.opts.balloon( cell ); //b.createBalloon( cell.labels, val );
				marker = b.createMarker( point, val, html ); 
				b.map.addOverlay( marker );
				b.overlays.push( marker );
			} 
			if( b.opts.enableGrid ) { 
				polygon = b.createRect( sw, ne, val );
				b.map.addOverlay( polygon );
				b.overlays.push( polygon );
			}
			b.grid[ i ][ j ].rendered = true; // set "rendered" flag
		} 
	});	
};

cg.Bubble.prototype.snapToGrid = function( lat, lng ) { 
	// returns [i,j] indicating grid indices
	// var ki = parseInt( 180.0 / this.gridsize );
	// var kj = parseInt( 360.0 / this.gridsize );
	// while( lat < ( ki * this.gridsize ) - 90 ) { ki--; } 
	// while( lng < ( kj * this.gridsize ) - 180 ) { kj--; } 
	// return [ ki, kj ]; 
	lat = (lat) + 90.0;
	lng += 180.0;
	return [ parseInt((lat - ( lat % this.gridsize )) / this.gridsize), 
			parseInt((lng - ( lng % this.gridsize )) / this.gridsize) ];
};

cg.Bubble.prototype.updateGrid = function() { 
	var b = this;
	// only add new grid components, don't push the reset button
	b.boundsToGrid();
	this.loopGrid( function( i, j ) { 
			if( typeof( b.grid[ i ][ j ] ) != "object" ) {
				b.grid[ i ][ j ] = new cg.ClusterGridCell( b ); 
			}
		}, 
		function( i ) { 
			if( typeof( b.grid[ i ] ) != "object" ) { 
				b.grid[ i ] = [];
			} 
		} 
	); 
};

cg.Bubble.prototype.zoomend = function( oldLevel, newLevel ) { 
	this.currMax = 0;
	this.buildGrid( newLevel );
	this.placeGroups(); 
	this.render( true );
};

cg.Bubble.prototype.moveend = function() { 
	this.updateGrid();
	if( this.placeGroups() ) { 
		this.render( false );
	}
};

/*
 * Constructor
 * @param data List of objects: [{"region":<region-code>, "val:<value>}]
 */
cg.Choropleth = function( parent, data, options ) {
	var options = options || {};

	// inherit from ThematicLayer
	cg.ThematicLayer.call( this, parent, data );

	this.opts = cg.parseOptions( this.defaults, options );
	this.dataMin = 0;
	this.dataMax = 0;

	this.init();
};

/*
 * Extend ThematicLayer base class
 */
cg.Choropleth.prototype = cg.extend( cg.ThematicLayer );

cg.Choropleth.prototype.defaults = { 
	"colorScheme": "Spectral",
	"colors": [],
	"reverseColors": false
};

/*
 * Initialize
 */
cg.Choropleth.prototype.init = function() { 
	// TODO: better error handling
	if( this.data.length < 1 ) { return; }

	var d = this.data;

	if( this.opts.colors.length == 0 ) { 
		var schemeSet = cg.colorSchemes[ this.opts.colorScheme ];
		this.opts.colors = schemeSet[ Math.min( d.length-1, schemeSet.length-1 ) ];
		if( this.opts.reverseColors ) { 
			var c = [];
			for( var i = this.opts.colors.length - 1; i > 0; i-- ) { 
				c.push( this.opts.colors[i] );
			}
			this.opts.colors = c;
		}
	}
	this.dataMin = this.dataMax = d[0].val;

	for( var i = 0; i < d.length; i++ ) { 
		this.dataMax = Math.max(d[i].val, this.dataMax);
		this.dataMin = Math.min(d[i].val, this.dataMin);
	}

	this.render();
};

cg.Choropleth.prototype.createPolygon = function( item ) {
	// TODO: error handling
	var regions = cg.regions;
	if( !regions[ item.region] ) {
            return null;
        }

	var shape, center, polylines, item, polygon, color;

	shape = regions[ item.region ];
	center = shape.center;
	polylines = shape.polylines;
	color = this.opts.colors[ parseInt( Math.floor( cg.convert( this.dataMin, this.dataMax, 0, this.opts.colors.length - 1, item.val ) ) ) ];
	
	for( var j = 0; j < polylines.length; j++ ) { 
		polylines[j].color = color;
		polylines[j].opacity = .7;
		polylines[j].weight = 2;
	}
	polygon = new GPolygon.fromEncoded({
		"polylines": polylines,
		"fill": true,
		"color": color,
		"opacity": .7,
		"outline": color
	});
	GEvent.addListener( polygon, "mouseover", function() {}); // we do this to ensure a "pointer" cursor
	GEvent.addListener( polygon, "click", function() { 
		var html = "<div class='cartographer-balloon' style='height:60px;margin:0 14px 0 0;max-height:100px;overflow:auto;'>";
		html += "<strong>" + (( item.label ) ? item.label : shape.name) + "</strong><br/>Value: " + item.val + "</div>"; 
		this.map.openInfoWindowHtml( new GLatLng(center.lat, center.lng), html );
	});
	return polygon;
};

cg.Choropleth.prototype.render = function() { 
	var d = this.data;
	for( var i = 0; i < d.length; i++ ) { 
		var polygon = this.createPolygon( d[i] );
		if( polygon ) { 
			this.map.addOverlay( polygon );
			if( !this.bbox ) { 
				this.bbox = polygon.getBounds();
			} else { 
				this.bbox.extend( polygon.getBounds().getNorthEast() );
				this.bbox.extend( polygon.getBounds().getSouthWest() );
			}
		}
	} 
};

cg.PieChart = function( parent, point, radius, data, options ) { 
	var options = options || {};
	cg.ThematicLayer.call( this, parent, data );

	this.opts = cg.parseOptions( this.defaults, options );
	this.point = point;
	this.radius = radius;
	this.scaledRadius = radius;
	this.bbox = new GLatLngBounds( point ),
	this.marker = null;
	this.init();
};

/*
 * Extend ThematicLayer base class
 */
cg.PieChart.prototype = cg.extend( cg.ThematicLayer );

cg.PieChart.prototype.defaults = { 
	"colors": cg.colorSchemes.Spectral[ cg.colorSchemes.Spectral.length - 1 ],
	"stroke": "#000",
	"labels": [],
	"opacity": .8 
};

cg.PieChart.prototype.init = function() { 
	this.render();
};

cg.PieChart.prototype.render = function() {
	this.scaledRadius = .01 * this.radius * Math.pow( 2, this.map.getZoom() ); 
	this.marker = new PieMarker( this.point, this.scaledRadius, this.data, this.opts.labels, this.opts.colors, this.opts );
	this.map.addOverlay( this.marker );
	return this.marker;
};

cg.PieChart.prototype.zoomend = function( oldLevel, newLevel ) { 
	this.map.removeOverlay(this.marker);
	this.render();
};

/*
 * Basic vector shape
 */

Shape = function( point, radius, options ) {
	if( !point ) { return; }
	this.point = point;
	this.pixelOffset = new GSize(-1*radius,radius);
	this.radius = radius;
	this.overlap = false;
	this.hidden = false;

	var defaults = {
		"shape": "circle", // or "square"
		"color": "#fc8d59",
		"stroke": "#000",
		"colorHover": "#ffffbf",
		"colorActive": "#ffffbf",
		"opacity":0.8,

		/* location in google map pane hierarchy */
		"isBackground": false, // set to "true" to have this be unclickable in the background
		"zIndexProcess": null,

		/* interaction */
		"animate": false,
		"onclick": null,
		"onmouseover": null,
		"onmouseout": null,
		"infoWindow": null
	};
	this.opts = cg.parseOptions( defaults, options ); 
	if( this.opts.opacity < 1 ) { 
		this.opts.opacity *= 100.0;
	}

	this.percentOpacity = this.opts.opacity;
}; 

Shape.prototype = cg.extend( GOverlay );

Shape.prototype.makeNode = function() { 
	// default is circle
	var div = document.createElement("div"),
	radius = ( this.opts.animate ) ? this.radius * .5 : this.radius - 1,
	color = this.opts.color,
	bcolor = Raphael.rgb2hsb( color );
	div.style.position = "absolute";
	this.paper = Raphael( div, this.radius*2, this.radius*2 );
	var c = this.paper.circle( this.radius, this.radius, radius ).attr({ 
		gradient:"90-hsb(" + bcolor.h + "," + bcolor.s + "," + Math.max(0,bcolor.b-.20) + ")-" + color, stroke:this.opts.stroke 
	});
	this.div_ = div;
	if( this.opts.animate ) { 
		c.animate({r:this.radius - 1 }, 2000, ">");
	}
	return c;
};

Shape.prototype.initialize = function(map) {
	var that = this;
	var c = this.makeNode();
	this.maintainOver = false;

	if( this.opts.isBackground ) {  
		map.getPane( G_MAP_FLOAT_SHADOW_PANE ).appendChild( this.div_ );
	} else { 
		if( cg.callable( that.opts.onclick ) || that.opts.infoWindow ) { 
			c.node.style.cursor = "pointer";
		}

		try { 
			c.node.onclick = function() { 
				if( that.opts.infoWindow ) { 
					var info = map.openInfoWindow( that.point, that.opts.infoWindow, 
						{ onCloseFn: function() { 
							that.maintainOver = false;
							var color = that.opts.color,
							bcolor = Raphael.rgb2hsb( color );
							c.attr({ gradient:"90-hsb(" + bcolor.h + "," + bcolor.s + "," + Math.max(0,bcolor.b-.20) + ")-" + color });
						}});
					if( !that.maintainOver ) { 
						var color = that.opts.colorHover,
						bcolor = Raphael.rgb2hsb( color );
						c.attr({ gradient:"90-hsb(" + bcolor.h + "," + bcolor.s + "," + Math.max(0,bcolor.b-.20) + ")-" + color });
					}
					that.maintainOver = !that.maintainOver;
				}
				if( cg.callable( that.opts.onclick ) ) { that.opts.onclick(); } 
			};
			c.node.onmouseover = function() { 
				var color = that.opts.colorHover,
				bcolor = Raphael.rgb2hsb( color );
				c.attr({ gradient:"90-hsb(" + bcolor.h + "," + bcolor.s + "," + Math.max(0,bcolor.b-.20) + ")-" + color });
				if( cg.callable( that.opts.onmouseover ) ) { that.opts.onmouseover(); }
			};
			c.node.onmouseout = function() { 
				if(!that.maintainOver) { 
					var color = that.opts.color,
					bcolor = Raphael.rgb2hsb( color );
					c.attr({ gradient:"90-hsb(" + bcolor.h + "," + bcolor.s + "," + Math.max(0,bcolor.b-.20) + ")-" + color });
				}
				if( cg.callable( that.opts.onmouseout ) ) { that.opts.onmouseout(); }
			};
		} catch(e) { }
		
		map.getPane( G_MAP_MARKER_PANE ).appendChild( this.div_ );
	}

	this.map_ = map;

	if (this.percentOpacity) {        
		if(typeof(this.div_.style.filter)=='string'){this.div_.style.filter='alpha(opacity:'+this.percentOpacity+')';}
		if(typeof(this.div_.style.KHTMLOpacity)=='string'){this.div_.style.KHTMLOpacity=this.percentOpacity/100;}
		if(typeof(this.div_.style.MozOpacity)=='string'){this.div_.style.MozOpacity=this.percentOpacity/100;}
		if(typeof(this.div_.style.opacity)=='string'){this.div_.style.opacity=this.percentOpacity/100;}
	}
	if( this.opts.zIndexProcess ) { 
		try { 
			this.div_.style.zIndex = this.opts.zIndexProcess();
		} catch(e) { 
			// TODO fix this in IE; non-essential for basic rendering
		}
	}
	if( this.hidden ) {
		this.hide();
	}
};

Shape.prototype.remove = function() {
	this.div_.parentNode.removeChild(this.div_);
};

Shape.prototype.copy = function() {
	return new Shape(this.point, this.pixelOffset, this.percentOpacity, this.overlap);
};

Shape.prototype.redraw = function(force) {
	var p = this.map_.fromLatLngToDivPixel(this.point);
	var h = parseInt(this.div_.clientHeight);
	this.div_.style.left = (p.x + this.pixelOffset.width) + "px";
	this.div_.style.top = (p.y +this.pixelOffset.height - h) + "px";
};

Shape.prototype.show = function() {
	if (this.div_) {
		this.div_.style.display="";
		this.redraw();
	}
	this.hidden = false;
};
      
Shape.prototype.hide = function() {
	if (this.div_) {
		this.div_.style.display="none";
	}
	this.hidden = true;
};

Shape.prototype.isHidden = function() {
	return this.hidden;
};

Shape.prototype.supportsHide = function() {
	return true;
};

Shape.prototype.setContents = function(html) {
	this.html = html;
	this.div_.innerHTML = '<div class="' + this.classname + '">' + this.html + '</div>' ;
	this.redraw(true);
};

Shape.prototype.setPoint = function(point) {
	this.point = point;
	if( this.overlap ) {
		var z = GOverlay.getZIndex( this.point.lat() );
		this.div_.style.zIndex = z;
	}
	this.redraw( true );
};

Shape.prototype.setOpacity = function( percentOpacity ) {
	if( percentOpacity ) {
		if( percentOpacity<0 ) { percentOpacity = 0; }
		if(percentOpacity>100){ percentOpacity=100; }
	}        
	this.percentOpacity = percentOpacity;
	if ( this.percentOpacity ) {        
		if( typeof( this.div_.style.filter ) == 'string' ){ this.div_.style.filter = 'alpha(opacity:' + this.percentOpacity + ')'; }
		if( typeof( this.div_.style.KHTMLOpacity ) == 'string' ){ this.div_.style.KHTMLOpacity = this.percentOpacity/100; }
		if( typeof( this.div_.style.MozOpacity ) == 'string' ){ this.div_.style.MozOpacity = this.percentOpacity/100; }
		if( typeof( this.div_.style.opacity ) == 'string' ){ this.div_.style.opacity = this.percentOpacity/100; }
	}
};

Shape.prototype.getPoint = function() {
	return this.point;
};

PieMarker = function( point, radius, values, labels, colors, options ) { 
	Shape.call( this, point, radius, options );
	this.values = values;
	this.labels = labels;
	this.colors = colors;
	// this.constructor( point, radius, options );
};

PieMarker.prototype = cg.extend( Shape );

PieMarker.prototype.makeNode = function() { 
	var div = document.createElement("div");
	div.style.position = "absolute";
	this.paper = Raphael( div, this.radius*2.2, this.radius*2.2 ); // compensate for expanding, animation 
	var c = this.paper.pieChart( this.radius*1.1, this.radius*1.1, this.radius-1, this.values, this.labels, this.colors, this.opts.stroke, this.opts.animate );
	this.div_ = div;
	return c;
};

Raphael.fn.pieChart = function( cx, cy, r, values, labels, colors, stroke, animate ) {
	var radius = r;
	if( animate ) { 
		 radius = r * .5;
	}
	var paper = this,
	rad = Math.PI / 180,
	chart = this.set(),
	angle = 0,
	total = 0,
	start = 0,
	sector = function( cx, cy, r, startAngle, endAngle, params ) {
		var x1 = cx + r * Math.cos( -startAngle * rad ),
		x2 = cx + r * Math.cos( -endAngle * rad ),
		y1 = cy + r * Math.sin( -startAngle * rad ),
		y2 = cy + r * Math.sin( -endAngle * rad );
		return paper.path( ["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"] ).attr( params );
	},
	process = function( j ) {
		var value = values[ j ],
		label = labels[ j ],
		angleplus = 360 * value / total,
		popangle = angle + ( angleplus / 2 ),
		color = colors[ i ],
		bcolor = Raphael.rgb2hsb(color),
		ms = 500,
		delta = 30,
		tooltip = null,
		p = sector( cx, cy, radius, angle, angle + angleplus, { 
			gradient:"90-hsb(" + bcolor.h + "," + bcolor.s + "," + Math.max(0,bcolor.b-.20) + ")-" + color, stroke: stroke, "stroke-width": 1
		});
		p.mouseover(function (e ) {
			if( animate ) { 
				p.animate( { scale: [2.1,2.2,cx,cy]}, ms, "elastic" );
			} else { 
				p.animate({scale: [1.1, 1.1, cx, cy]}, ms, "elastic");
			}
			/*
			if( tooltip ) { tooltip.show(); } 
			else { tooltip = paper.text(10,10, ( label && label.length > 0 ) ? ( label + ": " ) : "" + value).attr({font: '12px Fontin-Sans, Arial', fill: "#000", }); }
			*/
		}).mouseout(function () {
			if( animate ) { 
				p.animate( { scale: [2,2,cx,cy]}, ms, "elastic" );
			} else { 
				p.animate({scale: [1, 1, cx, cy]}, ms, "elastic");
			}
			/*
			if( tooltip ) { tooltip.hide(); }
			*/
		});
		p.node.title = "Value: " + value;
		angle += angleplus;
		chart.push(p);
		start += .1;
	};
	for( var i = 0, ii = values.length; i < ii; i++ ) {
		total += values[ i ];
	}
	for( var i = 0; i < ii; i++ ) {
		process( i );
	}
	if( animate ) { 
		chart.animate( { scale:[2,2,cx,cy] }, 2000, ">" );
	}
	return chart;
};
var __regions = {
"US-AK": {
  "center": {
    "lat": 61.4946165, 
    "lng": -154.104915
  }, 
  "code": "US-AK", 
  "name": "Alaska", 
  "polylines": [
    {
      "levels": "PMLNKKNKP", 
      "numLevels": 18, 
      "points": "kg{yHnb{|`@{eMnud@cpRwl[szTvvq@uhGyos@n~OuzTg|B_}h@~jK~ua@`ne@~qT", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKLLLKKMLKLNLKLLP", 
      "numLevels": 18, 
      "points": "{xyyHxx}v`@iiMfqEk|Tmr]mbFzoP|nCorf@saGh~MmnDkjNaaQv{LsnF}ci@bkMc|@xhIxwQfaCcdi@dvS|ScoCz_Njc\\h|w@mnTbpDviXf|T", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PNKKMKKLMLOKLLKKKKKKP", 
      "numLevels": 18, 
      "points": "slk|Hllli`@qiAviwBuo@_i|@{oPc}UtbAm|~@iwFqtNmbFtcIi|Kkz|@ktL|wh@yrS_bw@r~Qmb`@dbRfkMnBdrXvgVgtQyStb`Ajx@_eJnyJprFsjIv~SfzIi_F{aBrgi@xnH`pB", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKKKLLKMKPKKLP", 
      "numLevels": 18, 
      "points": "e`kaI|edg_@_hV_kk@ehX}zTiqNv~CyjWgu`@bmA{gr@kiM|rLuyZm~MmePctbAjhLcah@blU|mIng[dhtAp}c@zac@bok@`n{B", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PLMP", 
      "numLevels": 18, 
      "points": "a`xfInbpu^agPvlM}`Hquf@~hYxgX", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PMKKKKKKKMLLKLKLKNKNLLKLKLKJKPKKMKKKLLKKLKKMLLKJJP", 
      "numLevels": 18, 
      "points": "qw|cInmj~^u_L|ua@qvNcq\\jkAssg@ciKuh@pzD_x\\qsK_cC~X{wZanIndC}f@}}i@ecL`se@{iCk__@gyHfeLy`FgqEce@ahXrbO{jRusM`vC}hBygVstEte~@e|RxpXek]acoAdlG}c^bfH`aHztPckFwbJi`[}yUybOtdJq\\iuDmkSzvK?oxBatHtl[p|}@h_AwpHxcKvbOl_Ce~Ou_L}kL|_G{mGmlKqzFtqRosIv|H|~q@`aQ~fIyiJ~gMvrLw_CqrCb|K`wKqoGo}N|aWt{UebFkaEv|Xd{Jt_q@dg^jwdAxvBvm_@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PLNKLKKNLLKPLKLKKP", 
      "numLevels": 18, 
      "points": "}_~jIjt|k^evEjsg@es^neR_zN}io@omo@uei@nsDsms@qhNqiOesPcvfAt{@grm@pvs@ue`@h_Ao~h@`bRsyQeyOpp}@vwQbeLzgHh}^rh@xooBvo^jah@tcI|pq@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKKKLLKOLLKKKKP", 
      "numLevels": 18, 
      "points": "woslIddwhX_}Czo`@kaSlcUutGcmH{~Sxon@um\\fuKmj@c}QihLp`RiwMyzT|xb@wq[srCdeWnnr@gl~@rdJcyF~|C`gGfwM_iP", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKKMIMLKLKP", 
      "numLevels": 18, 
      "points": "eetnIhafbXewTua@chCawM{aWp_LtcBovUbrFwiQpo^wqB`xEznVgsPjyJziJuaBbkFrfN", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKKMLLP", 
      "numLevels": 18, 
      "points": "wlooIvz~bX{_NbbRcr]nhGwtGe}GdfXsrf@~~E~~ZpaUyyE", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PLKMLMLNLLLKKMINLKKKMLMOKLMNKKKP", 
      "numLevels": 18, 
      "points": "uq{oI`dm_XylFb__@}wLwvPmsRp}@jyXbcL{m@fm_@un]c}c@{og@xkNf}j@ucBr}PffXmdf@gsBleIj~MjpVqlIjgKlxIkgDfdOklYdwi@qqPseb@ieI}qD}iC~mP{bJgkAwuH_}a@mc@fje@yvIusk@c_Hdtf@mj@uro@c|KvxY}gHooaAxz{@o{x@r~o@paEgyAtwJp_ZtdC|wL`oQ", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PMKLMNLKP", 
      "numLevels": 18, 
      "points": "auhtIftpnXkI`p`@_k[ipTizB_`e@ovGz|XbKi{_AvjYnfEmsDhe^vdSzpZ", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKLLJNKKMKMKMLLKP", 
      "numLevels": 18, 
      "points": "krgtI~svfX{fGj`PivL{{GimCzxp@kmJd{JgjUsGgx@oxPe}S{aPpNwoWthUr\\rfErgOueDudXbuRyhn@f|DxbQpu]ebMakFfeIneIp|]", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PMLLLKLLKKMKKLKLKMKLKLKLNKLMKKKMJNJNLKMLLLKKPKKMJLKLLKLKKNJLJKNKLMJMLKLKKNKKKMMKKKKKP", 
      "numLevels": 18, 
      "points": "utxlIziudXavCbtv@ymNsnMua@jaZ}xFucPqpOv|Vm_Qmx@zfUdgPidOgyA`gIdeN{~EhaL}gH}vK}bCn|F_g@qhUohNxcRnyJviJajSuvIqpOj}N|`OmhEnzDjfJytG~xTwuOl`DfuKlxe@c~M_~R{Sd{}@_|I|lFo}Gw_LvmEatbAcvCrz[c`IzrLw}BwcPgeGjj\\mpO}nJsoI{h^`sIjmbAkbFllRmaUtdCmtCiaZofZmlRyoB|nSkmo@jiBuvI|aeAgoLb`B{}BudLc`IzyGbhCu~v@tdJe_Aa}JanWdgPs}W|vKgdFftJphUzqK_vJreKgzcA~ia@}ml@tgd@_cJe_Ha|Iv|XclPv}Ius[vrEf{Cima@xlgAlxIlkCboCshIp}Pzz_@amG_gg@jmIukh@~gJtvg@s~C_bi@jdHgnRbuRuhLto@tb]l`Ky@kq@}r\\{~Lw_Nz`HgeGvoWzqDmP`bRvqK_jCrbHjn[goEe|p@`hJviHrgMerFf^`sNhzRq_Szt@dcJhlPwN", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PMLKMKP", 
      "numLevels": 18, 
      "points": "qtevI|ryiX_rThhh@wrSytU_s@sim@dtJujPvpX`iKxrEvw_@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PILNKMLP", 
      "numLevels": 18, 
      "points": "ydnuIjp_eXerV~`o@g_H|gHmkf@_tAhxWufa@neBiu]pfZi_OnwOjgY", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PLKKNKMKKP", 
      "numLevels": 18, 
      "points": "u`ywIjqkiXy|Ahr_@unOneBijGarMsc^~`On}@is^vvg@k}s@h{Cvxi@taGicEdgBnsI", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKKLLKMKKKLMKKMMKKKLLLLMOKMKMKLNKKLLKKLKLLKKKMKMKLKP", 
      "numLevels": 18, 
      "points": "egxtIn`pqX}dLnhUglPuqDwqRddMg`IsmSvcB|sVqsKu@mvNyxR~pLyvBylFoeIj}GcmJafVeaC}_NbwF`jLf|KkiMtq`@o}Ns_j@juD~g_@}_N_sEjhE`pRgnK`yMitX`g@tdJcuWseRfkHv|Hi{h@{iQlr]reKyvs@fdMmfLh~OySrfLz}Rk|Muv^spOnh@lcGeo\\|`O~iJppOynOxsFbfHanIfpb@zfG_`NvyL|lM`wKu}P~`AhkOdp[kzI{_NniVb`PvbAv{GiyQprC~uJx`V|_BitC`fMklg@feBd|YtbHcK|zOxfGsjPplYp}@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKJKKKMLLLOKKLLLOKKMMKKKKKNKKKP", 
      "numLevels": 18, 
      "points": "ubmwIfihnXo}@v`M_mVuNwa@fxGoyCuvIkkOn`Mulb@qtEdzIriOmfQjeYlWid]mwVdav@g}Lgi[hlPs~iBvsMaiKc_O`cE~cDcgn@p{UeeWvjI`bKrra@ukJhnDbuPgfm@lm_Ad}Sw`HpkC}iQtaN|jD~aBotZ`tAbqLphNmrOfvLh_OamH`yr@dfHi_A|bChr]", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKLKMKNKKLP", 
      "numLevels": 18, 
      "points": "}kyzIhdb|XorQetAyfNkoUefAbiTgb[vsDy@us[pcPye[sNfmL|}RcjNdlWdfOneBzvg@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PMMLKKLKMLLKMKLMLKLLLKMLLJPJLKLKKLKKKNLP", 
      "numLevels": 18, 
      "points": "qgxuIf{ztX_jfAlwkAqu]cze@f{Jd_V}sO_pDmj@xmGpbVxhYe|Khl@}{PgmXp{Nthe@cx\\ejL~rGdk[yuHjfS_oJovNqnMdiK{kLkoc@w{Gldf@ahJdKm`DgaSlwAfvZigRmjLjsBn~d@exUzkZ{Zgtf@}_Gb|YmqG_aO_}LibAu~C}if@nsDehEfuKp{UgwFwhl@xoIfvEb{C{te@ptLmyQqpAdfQbhCsjIfbDngFrbHka\\n|eBwqi@~~kBvgF", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PMKMNKMKMMKKJMKKJKNKLKKKKOKKKKKKKJNLKLKKNKMLMMKNMLKKLMMKMMLNMKMKKLMLLKLLPLMKLLKNKKMKMKJKMLMKLLJKLKP", 
      "numLevels": 18, 
      "points": "erhyIpryj\\{m@vc`@cun@kmhAxGnbd@ivZ_ak@o_C|_Lpvc@n_x@gxNnpAgdMgg[k_Ah~`Bp`KkPdzBwmNe}Lk_VpBqi_@rc^bvJdrH|aYhxGkPgzBizI~pEv~JqhNzvD}jKnrf@wu]gP}_U|rNy~C~zd@_{AwgHarFblI~Xy}Rw|OboC{zVs`b@`wD}~EqlK|ZnwAwbVo~AdkHwxKseRaoCowXtmE}_j@n{LgzBr~ChtXySqc^~vYscKhnYglq@orX`db@or_@xmGhmCsc`@qeRfxe@~}Dwly@qrQvq~@{dShfCalNw~v@ppr@kqYksPf_CleBgzPsfLtjKfeGgub@ixU~q]pqIcqq@dmOqgFqpd@dnKhuKekd@}}`@|lk@dgPcsxA~aP`oQv_Sw{E}eToyCgaCgel@mbMeFljUydx@fqUbzj@gtCwmSvlMzfGsgFuoP~yNddFv@mmv@xeb@|zd@g{QllvB|eF_aHdgIv~XsgFetm@xhPwif@|cKx_EppHx|f@shNfcGuGpav@`mHjdA~`H_ki@rbH`psAxnHhIbfHl{LavJffO|~SuvGbnBrcq@eKs~]pnFrgMfcEg_V~rGt}IuyEl}L`lN|gQnrCytNl_Xxwv@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PJLMLKKKKM?MN?LLOKKLLKKMMKMKLMLOKKMMLMKNKKLMOKNLLJLMKP", 
      "numLevels": 18, 
      "points": "_rb}Il|d{Xs~Cxt\\scW~h`@vzMmcl@_g^~|v@q_CohUaDdr_@wxKkzDuxR|dZedFxmc@kpA_i@wu]o{Nf|[cvx@q@pAysr@bimA~Qqq^kbTtnOge@ioNz}Y}{NprCcaQqpVnjNuaGo{LxpJ}~Zm}Uqj`@byVk`|@|xTzuV{Lhoa@jbFw|]tlDhg`@zeFqg[i~d@}po@pfSilxAtyS_}EhqG|oKt{GyhIq_Svcw@llYcrt@nzDptNaRdvj@wvg@`q~Bbkd@g`fBxfGgqGhvEd~F}kEmguAvbt@ofSr_E|na@wa|@jj~ChlP_wRfvEnsRn~Hsol@rgFfyO`mAiuRpoNmv@d{QtpZ", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKNKP", 
      "numLevels": 18, 
      "points": "qcebJl}mrXijGx_cA_wKbtMwyEgt_@`}Zu_q@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKLKLLMKNKMLLMLLLLKKPJLMKKKOKLKOKKKLLKKKKMJKLKJKNKLLKP", 
      "numLevels": 18, 
      "points": "yq}zI~yrtXghZ_qEu_LrxIaR_{VscIvrLmcGkfXymN~dSxjKi}h@myJibFo\\h__@wwQphSeaJsgi@p|Ftli@ozR|aPahtAn{ZuxYouMd~MryJmsRncWkrHijEyjDdwKoqWdfA~lO}y\\hl^_aV~Qi|cBtzM~t@||v@qyv@zhW{cB|qM_tO{zOvc`@{yaA`at@jhE{xMk`R`_]nlKgkHu@pkJ`nIqyQirA~nQzm^cjE}dEopHrfa@kwd@nnFn_E`vC_|Ynj^myQg~Fnwm@fbD}jFbfAh_JjzBezWr`F`vCym@kcUh`KksBbnIfaQamO~vi@nkXcaQn_a@xhu@tyLngp@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PNKLMJLKMKMKKLLLLKOKKLKKLLLLKKP", 
      "numLevels": 18, 
      "points": "oo}`Jdspc\\goa@xxuA}gHgyHh`Im~t@}jR|gf@usFudQt{Gyjp@qfS~Qo}GvuVu|Acrd@auI{rEjyAan^frH`wDdbRgzWyrS{aI||Jwaq@t}W|vIwmUqo\\z}KejErjWj_V{oBfwTudQ`zIveDfdMjlIo_Caz@~iLhoLodQrhGhls@u|V~fBhfXlaL|f@np[fqNdyA", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKKKKLMLKOKKKKLP", 
      "numLevels": 18, 
      "points": "ow|kJ~bxe[ecSs``@wjDjtJwpHe`YuqDvvD{do@qlaBq`TjBhbAm`c@|~LpmPg`Bij^~u]lxy@t_S~vWb`IwsArsDjaX`eN{`AheNz_uA", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PLJPLKKKLKOKKLMKMJP", 
      "numLevels": 18, 
      "points": "uivkJtiyt^uum@``gEipMn}c@}oYzjYjPenvBgwMoaEigRe~{@vlFolRaqLgbw@d_O}wG`qEmwiApdX`rH`jLchJnaE`iIl~Oicc@raNt~LnkJjr~BdjEua\\hlIowA", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PLMLMNP", 
      "numLevels": 18, 
      "points": "gctnJpsx}ZyuHnuMeqNekd@cl@znm@u`Tw~ZvoPmo}A`f]~taB", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKKOLKJKP", 
      "numLevels": 18, 
      "points": "}t`oJn}oz_@yiCri}@}a`@xvvAqoGaYozK_|W`fVobMjxPcexAb~Mo{a@fyAvyL", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PLJKMJMKPKKMKLJKLKKKMLKLKOLLP", 
      "numLevels": 18, 
      "points": "ird_Kt~nj_@_kb@|r\\_mBts`@qgZ`vq@m`b@~~wBhuD~lk@rbVjffAo}Ifcv@_~YbkVa`^_rT{zV}V{SahJlgResG``Iagl@eKfvSf|Df}EzoBc|IugFs{^reK{foAaxSwir@oeB}tcAhgRaul@`oJ_vEt|HnaIhoc@wapDaYc_~Arz[~d^slD~y{Aftm@`c_A", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PLKMKKNKLNLKKNKLNKMKKMKMOKKMMKKLLKMOLKKLKKMOLKKKLLMKKMKMLLMKKKKKKNKKNKMLKLMLKNNLNOLMMKLKLMLNKKLKNLMKNKLKLLL?KKPLMKMKMKKLKKOLMLKNKKKKLMNKLKMKLKLMLKLLKLKLOMKMKMKLLLKMLKLKLKNJLKMKLJKMLKKPKKKKJKKLMLKKLMKMLKLKKNKMLNLKKKNKMOKOJLNMMKNLLMLOLLLLKKNKKLLNKJJNKNMKKKKLKMKMKKKNKNKKLKNKLJLLKNKLKKKKKLKMKKKLLKMKLKMKLKKNMKKPLLMKKMKLKKKLNMK?LLLLNKKMLLJKKLNKKKKKKMKLLKKKMKLKOKKLLKKMMKNLLMKKMKLKMMKLKLLKKLMLKLMKKLKKNKLMKLKPKLKLLLKKOIKLOKKKMKOKMKLOKKOKPLKMLMKKKMKMKLKKLMKKKOKJNLJMMKMLLMLKKLKLMKLLMKKOKLKLJKKOKKKKKKMLMMKLIKLKMLKLKLKKMKLLLLKLKLLKKLKMKMLKLKKLMLLLKKKKLMLLKMKLMKLMKKNMKKLMLLMKLKKOKKLKLMKJKKKKMLKKLKMKMLLLKKLMKKKKKLKLLLJLKLMLMKMNKKLLMKKLKLMLLKKMLKKNLKLKKMKLMPKKKKLMKLKKKLKLNKMIMKMKKMLKMKKNKKMNKKKIMMKNKMKKMKLOKKKLKMNLNKLKNKMLJPJKLNKKMJKNKKNKKNLLKKLKLLKKMLNLKLMKKMKLJKNLKLKKLMKLKPKMLKMNKKMLKKLNMKKMKKLKOKLPKLKKKLLLMLNKKLOLLLKLKJMKMKPLKLNKLKKMLMMLMNKLMLLOLKKKNLNKLLLLKLNKKKKKKOJLKLKNLKKMKKLKKPLKMKNMLMMKKLLNKKKKMMMLLNLMMOKKKKMLLMKLKMLLOKNKKKMNLLLKPMMKKLMLKKLKNKLKMMMMLKKKKKKMLOLLKJOLLLKKKLOKLKPKJMKLLLLLKKKMKMNKKKK?OJNMLKMNKKNLKLMKKKLLKLPLMLKKMKKMKKMOKLLMLLPKLMKKKKMNLNKKKKMKMLMKMMKKKPMKKKNLNKLLKLKKMNMJLIMKKLKNKMLMMLNLMJNKKNKMMKMLLLLKMKMKJPLLKJKKKKNKMLNJKKKKLLKNKLKLMKLMKLKKKKMMKMNNMLKNLKKLLLKMKLKKLLKMKLKLKKKMKKKKJLKPBBBPLKLLOMKKMOKMKLLNMPJLKMKKL?LKMKKLMLLLNKKLKKKPL@LKNKKKKP", 
      "numLevels": 18, 
      "points": "}rfmIp}s|Wu|f@jxIxx[aKb`IhbTceGnjNw`]d_Ai~FpbM_iRi``@bbDkrVu~o@wdq@x{l@jax@owHveKlxIf|Tm{E~{WykLr{@yhPeyVwcBkm_AuuHvzFrgFl_h@cnlAnfC}~Ll{L_xEe~F|nAhdOsda@xnf@g{Xogd@vrZf~{@o|Fb`Pbw[lxaB~zHaz^tbOvqTz{ImiHvyLxoKqlK~hWdvLqzMhfQvwE{{Plth@mk_@fsPzeFybQgxN`Dmc@wtWgtXjrAccEazU}me@tcBmxIoxzAkq@dkpAeaXzjK_|B`qc@qiO~dEs_Lvs]ipTk{Ep}@~gm@csG_cQijGbqLwrS_u^vrL|mZgfQ|}r@s~Xjd]fyAoi]uoWxpCvyLtdQmgKznt@wqKkqGa|BhjGwt@jwOl|MjlIsbOhcq@uqRezN~Xayk@s}Pcze@xoIrgb@cqEjsg@_gPq~Q}LjeYosRdbD}aI{}b@tdCbft@osKjjNu`Mk_Clce@mv{Bu_q@z{hBgi[?flIqxqA{vKtavAllY`gW{n_@zb_@ckF_fObnI_|PayMwiAwfGz~QizPitQnl`@zlk@_kTdm_@qid@fK_`GksPooN|rEwqRilPm_Cas\\`vCn_h@lby@fee@uu]xn`AapDhbp@qgTfyAc}a@nrh@btA_gNs|]tbFbeNx`O_jSl_V{bYlnAwpBtIqxu@r~f@mce@mfCr}^fsIupAb_]raUsqe@nwV{zHeeUz~SydEt_Z`|Y_~`@rwXnmAt~}@gfk@~rGdmJ`m]uiXpwf@ie@wfEfoq@yih@dwYtkSuv@owHhs^zsFv}u@kcNojGlP`kMefAu_Sq`TvxGmmC_lLuqi@jmo@sbO}jy@ucBp|d@dbKhjNcbKiq@s{Uj_XdfOogDl`D|mPo\\alUngMiyAj{SvtWwvIxo^yoBu`V{hB`ni@esWpe@vuHp}PccSnqWnuTseRleBn~H_x`@zalAbxY_j\\pwAbsWjxPdtQqgMuxYj_Ja_pAj}GeaQ_wDjd]r|VuaUfvEgyOgrO`oJ|}Kgy]`dM|kc@bgBipd@qfLmuF~cTi|`@b~FjsPjIc_X`aXcbIhxGjqIrsDxud@qqPbyFwfGl{c@xbJmkAxbAhiK~xFerMg~F_dMrzMqdHgmJrwm@xoBpeIbfO}iQd~FlmQ{eF~uJ}`HgdFauBxi_@apKbhCd~FvlDmxIpdJxuAzyZeii@zggBe{Jshc@pgFtik@qaa@`rq@s`TlnFuq`@vu_Ao|Fj}z@sNkoSu`M_uIjeIzqb@ofa@xlnBxm@efO_xLtzTzrEliM__d@f|gB{_Nawr@g`RyvRmta@f|[inRwuXpkXkwd@vpXrbHtxRqaN`nBhhN~pEqvImvGa}Jqyh@tqItrCijjAmgKbcaAwlb@fcv@d|RfnMvoWrdo@dnWvbnBmxb@|ckEitQo~c@_oQl_CiaLpuTdhCxzO`aQk_Q`_Mlr_A{v]frbEviVrncFicG|uq@{bAkl[q_Sbvo@mfJogKvjBxmjAw{PnjWgvCrkm@_l\\gvZuaGiq@v|AxuQsac@cpVkeIij\\t_Fdu[nyOvyKpzj@n~lAhgBbsWqoUhlz@mBt~v@iyf@ul|@v|Hbco@edFwfLzm@laL_aH}uC|dLntZuaNmzKjhLbq_AkoS_hm@qxI~uCzzMz`k@e`Ij`FnrQzxb@}bChv_@{zGxnE{kPypsB}lJrqZnbMhyXdDv{q@eaJym@miMl|YlkAck`@ckFdfVi{JkcG|L}hR_xEv{N}hB}_mA}yG~dJoBznv@pid@dxhAqpArhLowHa|Gkq@j~TtxKprJ_jLpoGhkAb_M|wLkaCjdHfuTyoBbbPo}N}~LxqDzxMm_JgmC~vR~}T{{^euKutNvdLtpXfmHn\\`dMfrAimJnmZ_aAukCvpXabKgyAfwMpkQhbFurJj^`sUi{Uhoc@qup@c|cAas@tyJguKmvEhqq@tt_AulRjfQrlK|sp@xt@chHngKb}J}gOoqs@poU~sQkrAr~Op}G{bJtaNzlFirAfxNf~F}hIxuC|eeAayAqgp@toIlzb@rpC~`AdjJ~cDmtSy{x@be\\btH_xZugd@xrZ}kEz{PzhYeeGhk]j_Xpje@ybQill@pyQebg@cxLqiA}fGqoIfmJatAw_SafMldZiu]rbMvx[owC`tQjyJgoG}sCrdUtsFgdFz|O|qRmhElwMleIi~DztItaNqhNm{j@z_EtnHllD_sNvbHhbDkeNktQthRv`QiyGp`Wxv[hsUdpM_hAo|MbyTlmLlIrsFxqRm|FnkrAypCl}GslKmjNqNptLpzb@|u_@k|[~{BiaSpwVfrVweDxv`@~lm@fbTw}RkgDtkSar]xjBigKlzMbzWv{Ee_AfmSb|K{hRruVecCa|Ydww@l}NubVpiHd~F|lFpfLe|KnmSj{S{fGgWj`Rr~Jyt@fuKnte@aip@orZjaq@dto@etJr{L_yMweKn~Hvb_@jfJoiOpsD~oKn`De}ElvUfy}@vwJo|FvuIr}MmqQb_PcgBhhh@vqRaf[mvG~fz@lbR|g{@g{Jt{EatH|sh@wgMywEkx@sjWauIr|OqmLoei@z~E_}{@{bQhcLinKijs@{gHbhCuwXm}e@v{U~{sAj`DpoGnaEycKgoZx{xA{hu@}i\\sac@c`w@a_]uzF_}CwcPc_]oqDcxc@`bYwwJcvdAujn@ovvBpjWigjAomLqpm@tvWewxC}|QzcY`gBz~c@{ek@ffjCc{m@kvhAqeR}xuAl_CzswAxoPb|b@zwZbsUcmA`gaBk|T~~LlvNrjBhwMlzeA``^lni@`bYvhoBtbOj`K~qT{nQqzDjw]tbOnid@vq`@tlr@`jLjx@ddFyhPd|Rfbb@x`Mh{e@a~Dzwr@kfJl`DlsBrgd@b^ah_@pzHycBxv\\cwaApc^lzWtqI|wbBptEtoIdWcpr@``WpbFfiKzmb@{m@`|e@}pLo|RcjLvoWrl[~uFt|AdeL{vKz|E`}JnhUjyCmyZvcIj`DxbAxxv@pyCqlTnpOenBtkJrelAdsB{ae@xvIrb_@vxRfyAtwJfgYjzB_nPhgRwcBizI}kUd_Ae~`Ar|Oc{t@rfSmsYz`A~pL~`AisRnwArdSjfXjrOfqNdl^n_Cxcw@frO|qMftCa~F|pCfz`@hhSeaSfsPtbdA|f@{hn@t~CnrXdjEqoPpmExjI~ExpQ~sHkcNscBf~ThjNuSafV`z]`jS{rDejEl}YnyJsuJlcG`xEefHj}PbcLbqUilB~ap@hoLfwOjhL}vFtbHrio@txRcgBo_Jlax@n{LjhE~zHuiHt~Cdrb@hmQooEywCjby@hxGyvBzLdePl~OwlM{lFzv`@nq^fdbAvtGdkAspAaqj@rrJdwT|yGydS`kF~|Cn_CfoSbdMxrE_YjaZfwMw~Q{dLncl@bw[zrE{yNhtZryLqdAxnOz~ZwwCnsRfuDs_G~gHjrL{fNhsl@`mO{oI~`Hhyf@|sHupV`nIvGvh@hyf@ioL`~RfpTxa~@|fGtpAecEirt@voPjnD}yGtmq@hlIta@f`B|bv@r`b@dik@pjBe|TefHlkCsbHs_S`hJ_}o@jrHjrd@z|JcdKoyJ}ji@zeTzgm@qiHtjIlnTva@qfE`tOzvRw~Jg|DbuW_qEmfJrdCvzOwiJ~k@auPwbXm~A`f]`rFksKb`Ir}Pe}Eh|FnpOs`FprC~xMrqBagPplKziC}{Idac@lyQ|eMxsFllsApjPbtK_rTrdG`bBtaNjwVgxFfjc@tlViuDpyXajEioZueDbaQioE_yMclGjkH_yMkhJsgFxxi@zdLpkCwZ~ia@dzPp~CgvEjlPlbMee@xnAhyv@roGykLxhWtyZkmXvnOjnKpw_@~_GydStaGt|Ad_AhaZccLhlPre`@zebA}`Aztq@mwVulB}{P{xTdwFk}l@soPjxqAxeTra\\xeTskAvae@plg@wiCtqYrpXkpMdoC`mVgvEv~H{hIirFvvI``WzzOxEi|@jjh@whMbjPb^w{^ir_@xgm@srCq`FaKfkO~xM`wMzbJcxUlrQ~mGvzTqwOqrQnqPv_SzeOtcBbxZeiKx|QwwCmdJwnVjcs@deG~tIz`Og|DzfNyb_@voWtt|@qvGz~Cs}IquT_g@jcNgwFmeBrGk`Raa_@tpOs|V_xz@~wLr}IynAk~d@g~Fo}GarFnfJedTaqmAevLhtAtjB|cT}uyAav`DclUciqBlxIdn`@rv@ieWkkH{egA`hJcrAv`Frd_@l_Cm`RjeI|mBraUoh\\gaCauYgxGzjRwdSnsDvnA}|v@`kM_fFboCi{h@}aIhuKitC{zMqiO~r_AumaAemf@{{s@eqfBi}\\gtyBsUzvIe|DcrDch_@}}gAreRv}^o}GwoNfqNutz@uei@nrJuzMi~Hy{s@m_fAquFi~k@caX{yUgwMotq@|bQudC{}Bewr@euKn\\~zAfeItcImsD~Xjs`@y|Xpo@wdC~wS}dvAg{Q{yUggi@~rGwxp@c~Mjje@jgDdmXezPjnR_nP_bBkmo@{h~@coQw~v@_pDj`Yisl@kgi@}~\\ozMtiHlwOpkQpqBtjYtsk@`gs@nhsEagI`iY{hP`jEwqKlxe@guYmtLgmC}qM_kD~cMo}@ya|@haZwn]otEy_E}aWbuYwnH~kx@qeRdeUnpVqxP|jb@x{u@kePn`KccE{rGdhC~kNnjIe{Jnu[xhBjiFhoSudJubOoyCpoGtbHt_Ld`u@osg@xoPneYskCtsi@a{dAvzgAcnIhcj@utUaqCzoBzrZrtNoc@dfOjp]ijUh{Qk}@vtl@yvIhvL{dEgaLmcNxjM`pj@v~aBmoHxiKfwMjhmA`wEysErzL~xUjpFkmEhcUvepAe{JggI}}DpnF`wG|_Bq{HznnAcR}tu@sz[{`m@jlBvmUejc@`nBgtJt_LarMmnw@}`An`w@pjIfmA_fOhxWc`XpeJayEgzHzjKkrAuqYsjDgxUwlp@kcmB`ufBgkOkpFilIzoIsiHapRrh@bbYr`M_bBdbD~yNykLolBagPpfZ{vg@sko@quMuNmpVs{aAroGf{f@{_NvzMtuOu{ErgFz`[~kc@nq`@~sHyvBxnHp_c@l{LgpHiWh`[bkMa}o@bqc@ntJsNpjn@dcLjgK|rUvjjB}aBdhpCepT`rTeaJk{SojPpc|@y|_@fhm@sfLkrAjbFpvWuqRzxy@woIfhLm_C_dV{fNieGjdH`wr@yiJhoa@on[aeqAynOlgD_hJyo^amOnaLlyJcbRqoGshe@biKfsIzjDicGp`FymjAxpQy~HdnYxdh@{lk@}p}Ar`FsmZx{^g^s~Qk~bA}eMbnBfDgyJkzRprdBmbFongA}yGbue@{iJojNlsYnxu@p\\bctBwfNxoNewC`ly@h`HjpYanIjdV_l\\a_rAiInnk@fwIxhI_{KbcZscPs|V_zGvzMljG_|I`hJdjLovG|vi@mgK{t^uwJal@wZn_Jw_E_~RahJ}XmcN}rz@mrXofXjyd@zxuArcRjxWxpJ{xKz}Kvfc@n~He|Kh~OzdEkjG|ek@mjWpkHalGmpF{`H`vq@_{OxjIiqGad[{cKh`BuyEdbRrdJvgm@ezPrtLglWm{EvmN}|CyoIaehAgpFrim@sjP`iRyyEembBktZpr_@grVsjIugpAoqxBwa@mth@jnKkeBbwFiln@htJn`[ilIqya@kwFdjS{`H}rGxxDz~e@qrJwfG_vCfnKogb@wkhAneYfe|@wc`@zpQiq@uaWe_HxdUs`b@a``@pUi`lA{zVbmt@k~Oang@mwF}`m@x{Gq|pAd}LihQdcEl|DwbAmwVzdZhir@u|V_rr@~lOuoe@ylFwvu@ai`@yliAaqq@apnA_bIzqFprJgby@~{ItkZy|Oc|bEcrk@yifAqhUwuA{ph@|z_@me`@v_C_h]nnw@emC_cJduDpibAe~[s}Y`mA}vlAenDrtN}vKgwr@iuRw~Emlg@~_hAo~Aeh_@rUx|f@ju[xeb@vhGzv`@o|Mhnp@dqEqwOz_Ndu`@yZxek@vae@xgyAn`YlxI`{Hbr[_tVz{PekFuhGq}I~rj@qmSfhSrlK`sl@z_NqocAzeTbaZc`^xvjAirAv`zCdoQdofA}lFmkJtgFn{j@mkHpnFn|Miq@anBq{\\dcEr`r@kv\\~~jF{bZvlp@qp]eaSizR~s{@gaZtfj@_lNtuFsiMkaS|}YnfLluDwum@q~AurZuqI{fN{nHlxBcvE_rTljBo~}@g|TfloB}tIldaDuo^htuBokQzbJs~Omwt@nbMvfc@jsI|{@{gO_zj@okAqny@y}KvoI}vPyqi@ffAy`{@okJoz`@_rFn_Q{o@cn`@yyNalNczUmmvAxzM_|xAkeGgvz@kcN`jhAirQenT{oW_fuBfrH}}Wmi]{t|@qxF{s}@m`@olGytAq~pAr`Gii{@gtApc|@ngKwxb@roWjfZlqUiwFnwOt``A}hB{zr@|uQkxPhcGgaa@gdFeqnDzlTsdQcsNebcBp_Sep`A{lF~gC}dLgoUhK`oJg}c@_bp@~aD_ruAh{Sf_CzjBphLo~AewTefVwcKmePphWisKbdsBxlFfxc@vnOolI|m@bnIqkJrcIomS_nPcbRjqEsfa@ba}@wjDvcu@mjWbmXqfQqm\\_Fop]xeb@_m{@bfVhyJtdh@seaBezPumjAvh^y_fA}dCsrrBmjWgaCkjN~xT{_GazNtdJl~y@yxMj{x@h~Al|y@jgR~hTv|Azfq@c~d@vkkAin`@i`R}aPwiv@msKpocApvGtrfAi`KfiKrxKaFhyAxl]gl^uaW{uAzgH`f]zld@_|Rvj`Fgsn@xsRqpd@rqe@q}u@pdeCqdh@ny~Bu{Pd}kByo^|~fAgmJfnhB{nH_wcBewFztIm`Y_oZ_gWwjDsya@dqEozIeosJq{h@cetCunt@wphAflWzzO}vPkj\\}xb@kvIcvEfsNisPi{f@}~EnrOwuH{jKgreBqhdEzkEgln@jyAlhc@nuEq`UrtDrnj@|hFrpUiiFgcqAyeKq~OcvEyu`CkvEveDwvu@ef`D`fAcqh@~tIanBpaL~mu@}iAsju@`h_@lvg@i}G{rc@rq`@{o`@u}e@`zUchS}cMdrDqjZgmKi{jAzgFpxuAqfZnug@rlDj`b@uud@iyvAodOazaB~eFxmg@btCkfj@zzFp`y@t}Pwnk@qmLryJk`B{ju@waGzfNlnDillAsfE}yaAkcEfb`@ym@ksyBkrd@geuBcbp@{rxA}wSwg`AvrEevSfmC~~j@|zOgd]bhC{nbAtfEokJbkFv}KuiHo}^|rEozy@hhLo`R`_Vd{c@n}NvfvAdzBk_f@l{Zox@gfAcbMkyJij@wiAww{@swQckHyfLg|[vwAk~d@{wQlmQzEmpd@uqK|f@llBk`K|kU~fIqNgwMsbRagBf~RsslAx~QrcInuFlo\\hzRujvB_`Umqu@ouFggfCbeGqooAtzMugTubHkuFqyCphNxiAiqz@~nJo|i@r{Uv_x@pwHitApjKuhqAzlDdnjBel@igkDfdHdlW|uAglRfzIz~e@~cMqtpCuZwgH_qJpyC}dLkppApcBwhoAj~MdxEasSiucBso@kykA~fWkjlDf`P{}RyiHacv@jrHccfAfuRu~_@|oF}khJvrSggl@rwQc_|BmtQeveDfsNmxGebKwyG_lE|_G}`Ckrw@_w@girApaLkqIs|MyuAphUajeCjk]ue~@ngMabhBjgYk}aAvh@k_X{lFsuFmsBlrOpoHycz@jdlFyDxlxNiMtraW_UfbuHsH~qOsr{A{aP_xL~xVua{A}y\\ecz@_hA{zuBxlr@~qVfpb@ik`Bv|XipMprgBqdgEj}_AomWyrq@cg_CbKk}j@ksW_tVyeb@fDy}I_{k@}_NnnTu{e@g~hDdxl@utxAnyQlh@`sG`xLzeFw_SpnTsgF`dFmpr@z_UiwVfWgoSfk^wbXnhTq`PvpXkwpAjcs@_plAj{a@qmLng[}wj@nztDsxpDlvUhpTpcIam{@zc`@fwMfaLmen@nrf@wgFa`@w_s@f{f@keaBpfEmxu@x~Siw[xpCyg_@|wSmiHnbA}q~@lxg@ojMdf]td^H?frh@w_Ebvq@m}\\|oIvsTpm}@nmq@nhUbkk@gnKmdAzuQdpT", 
      "zoomFactor": 2
    }
  ]
},
"US-AL": {
  "center": {
    "lat": 32.6248055, 
    "lng": -86.683485
  }, 
  "code": "US-AL", 
  "name": "Alabama", 
  "polylines": [
    {
      "levels": "PHKHBHHJIKHIHIFIIHLHHJHOGFGIFEGNIILIIHHLJHKGKNJKJNIMKKNMJPCAFCFLHFFCGEIFGEFEGLHIGPGFEGBHCECPBGCDEHGEFDHFFLHIIFIHIIHJHJIKHIIHKHMHHIIHJJIGKIFHHP", 
      "numLevels": 18, 
      "points": "gfebE|fffO|hMxxGjgIp~Bd{LaX~]uGpfHa|AvnCfT~vCum@rhKqcI~`LofB`xECfoGnrCl|Eq]|iMzdDbyEs`@xuDkGxdEjiCftGa|@n{Dly@jyC}z@p|@iyCz}Eg~DhbHubCvkNe_Bp@dv}A~n@rniB{Jhf\\`Vhpf@}g@`b}@SncNa^l}iAhBr`tArlHmu@dcN~~EtqDe|@jfKsmMngFq~AxiGm~KdpAy`G|yCq}BnjHo`@plK|rDx{CppCpuH{dDjaGwsA`wNj}Jz{F`tVf~Fnc@`uG~lf@`Adng@_sFinj@kfDgkCwxVfo[g`f@||@y_W`xS|nnAhsUsbL`ac@bbAzyNc~aAxaBmrr@viAenVn`@cn|@ndBmas@jxAkmc@`p@_eaAc{Eg|NsiAi~s@wfEwfbAc}GcgKut@uzy@mwE}xo@_|Dqyf@}cDmx|@u{GybEqSssl@meEaqZgeBcoUy{Aqp|@a~G}YdrBy|DxtEmnM~|Hyw@`EqNmxg@ha@i{hA~RoejA{By}Av{@sahAhF_~HfJetzAe@uz@fRewsAzLw{q@~}W}`D~ym@gmHfkFkv@l`KivAjnl@kaIfuf@epGhyWeaC`sIihAp|o@ooHbb_@k|DlsKwdA~|x@{uJzw@eA~no@{hIjqKcrBx|DytEt`Cp_@riAqs@j}@}cArtGge@juA}jB`|DjrAblBglB`~CsL|fCsrAndKqtMpoKkc@r}CuwC`kExa@v{@psAl`BeoApwCd}DjlBfSxbFqmOnwCodDvz@sBb{@|eAnLlqBvtB_o@`aAjlAzb@`gH~}Ba_BppApgHxmAlfBtvFxsDl~Eok@xcCl`AtyBl`@~jEe`@ddFprA", 
      "zoomFactor": 2
    }
  ]
},
"US-AR": {
  "center": {
    "lat": 33.815, 
    "lng": -92.301667
  }, 
  "code": "US-AR", 
  "name": "Arkansas", 
  "polylines": [
    {
      "levels": "P@EFLEFHDHPFEADEEBCGCCEFGDDENIIHJGJHIMIIIFIHIHHJNBEKIHPHJHKHJHILIIJIJHILHJIGJLHHKIIKGIJHLILGKHHKHGMJIHIHLHIHJILIHKIHHMIHKIIKLHJHKIHIBLHIFJHHJLIIIJIKHJIHJHMJHJLIKHILFKHJHGHJHLHIIKHHKKHHKHKHKILHJILHJJLIILJIJHHLIHIHINHKIJHHLHIHIHLHHKHIKILHJMHIIKJHKIHGHKHHLJHHJLGJHGKIKIIGLIHIHLHKJHLIJHKIILIGKIICPCDFHFBDEDCOEMHJHJJIIJIKIHJIIIKJHJHHJHGJHJMAP", 
      "numLevels": 18, 
      "points": "s`voEppp_Q_{{@sw@{jk@uh@sxd@oh@ea{AgbAm~m@nxFahVblBytbA~_JqgJzaAck|@prImaAh|@aIgvgBtFctj@]w~q@_Aqjs@qA{`E|Cs|uASoqMyDavp@uCsqhAl@usBrAiwtArBi_m@eCo`GhRmgu@yFqj_A}I{nj@eJ{wdAzDynM|uEooA~Tk|BxbEhh@hmBwj@`n@adFt{AwnDr{BuJ|gF~kBlzCynBfoDdeBdxAzpG`~GddCn}A`{DlwC|hJhfAfpAjuCjOpqBjsDxPpbCpvCp}D||RhmKyH}sQob@wp}@aR}cn@vpE}t@dqD{pHbuCmtBzxBpW`u@t~Ac`DvwHoUnpCxpBzzClnA`TfnAqt@rvDu~IxyAyB|~BlzE{_A`tCdiAf~DxbElz@tbBthD|}@dlEoh@|vHp_Cx`GdgCfEhaFijCx}BabFikBmoD~Lsp@p`Dgq@t_BlzAmU`tA~{DppNbxCbEjjEkbFdhBpz@nMheBs`@`{AuvDriDzx@tnGxz@`p@`}DvDraLagGdpD`fH`VnsA{pAftAm}GtDuc@bm@~[hzB`aEx{EptBf|EruFm]pFwkDoxCeo@a~@k}BuBihDnhAo{@h{CzgA``BnrBj~Bgj@d`Exn@xs@n{H|rCvnAtrBcmBh@u_H`z@}aBjcGecCtaC`ZtzC{bA`yBdLrjC|qByfA`{Jhj@r`C~aCtuAr_E{x@xeFjeDin@twQniHpsAziCoc@nrD{_IzbAef@ppB|DhvCdtCluAvwDxmBzRlqA`LjH~cCm_AfsBbyBteKzu@zqBkRfeA_hFsb@ssA`_Az_@tiE|oCdYdjEqmCt~Cn{AfrFmnBdyB~NvxApvE{QprBwrBnmAykB_qBguCzNqaBf{AwIdeAbiB~~Bv`NmyAzdAezBqLmoGhhEmVhsEdiGhFj{De|Att@ktEat@uxAphCvtI~pBfnBfu@doCy_AxqHwdH`lAzg@rbAfqDvkAtzAfsCr{@~hGw`B|aCl\\lpDdyCxpFbmIl_FnBbjApeCoLv}@imGmr@oyArf@tb@|fLpr@zg@t_HawAdqFp`AebCduEzBzuAnhCzkBxiH~m@x_AhgE_aEjuK``B~_@nyDmkAfxA_gRjwCi_BllBldC|E|mBcmFjaOnyDtwCtyDkdA|oCq_FfJ{xFnwJ`|B|y@xoKv}B`nCneB|JhaBkwAffAzUph@thCgn@~rAmiC~x@d]neCm~BnpFrgAvvB|zBeqArnF{dJroLhkGdrC_h@jgDiaDpmBooFvsAqf@buAxeAln@boC}a@`{CaiBtnC`~@|rFwUhdErr@zc@tnHq]jbAsw@hYiwCmdAgmHruAukBdjCcEz_Cb~Gg|AzgF_~FbgGny@jmH|pBtTz`Co|@tlEc}HnaCmVdrFpkB`OrzByaBhrFhtErDtiBmwAxCsy@x}A}cCxeAeNjpFfiDbvA|xB`cBpb@sWe~HkwBy}@yjFhNim@ox@dsBcaF~qCo|@fhBtCt{@pbAhbC~iLxo@f`@lkCyvBnQ}fHwaDuoFujHirA{SejAte@}nAjoDhB`fCjjBzgBpoDlsExqClfFteAtoIewBrwBqyBulGeeDqFokCxgAwrAz`FbwAn|BfiFpoKqb@dfBpz@rvAf~CawBz~Il|@vnBdiDc^`lCkpGx{CgtDjqBte@ti@jkE~sB|Wdu@dHuA~`QHtw`@yAvfD~V~|uBwh@fu~B_H|br@{Evop@mLvco@n@hlE_Hpey@iCfvk@_go@_M{wv@qBcdCj~Cci@t|CncAfjA|c@~_JyeD`Zju@n}GhhDra@cU~wCevC_lA}h@vwAx~DbhF}mCiNq\\`j@fz@~zBfnCfUgdBzcDb~CneG{mAbxCglAmnCukBoIoS`t@xqBjxAfHfqA{rCzgC~Bz{Aap@hr@cmAa~AmyBsA|Zp|Fc_{@uq@ahq@aj@", 
      "zoomFactor": 2
    }
  ]
},
"US-AZ": {
  "center": {
    "lat": 34.169769, 
    "lng": -111.933688
  }, 
  "code": "US-AZ", 
  "name": "Arizona", 
  "polylines": [
    {
      "levels": "PHHGHJLHIHHKKJMKGIHGLIHHJJHHJHHIILJHKHHIINIEJGIGIKHJHJIKIGIIMHHIIJJKIHJHLHJHKIHJHHIJHJHKIJIHNHJHJGJLHJHIKHNIHKEPFFGFEHIEPCGEDDGDPDNFINJFLHIHKHHIHHIHILIJP", 
      "numLevels": 18, 
      "points": "cvqhE|h~yTsw@joFb|@v|Hah@fuCwbA~dAha@ltB{_JfgHugDyJowG}bEkeJ`KuzAzn@wrDs}@sjFzgJ{bH}eEqmJjdCiq@arN}}BwyAiuDgz@qlBynCwpCycAm{HigJu~BtbAecGupAanG_KujBzdAg_Dw}FsxEhzAgqDyb@krInfBsbBwy@abCxx@ecKkmCcjDpjDanAmm@{sKslPanH_^_wCsuAqpFaaP_zD}hFw|A_uHuwNswOgb@gyCaeGrv@{gCpwBwrDbrDwzFnxMch@v~CasCtxBmvB`yDc]dqGukB~l@yrJ_k@weHvlEg~AlxCoiAejAsiR`nGayE~gE}XllDadA`fBm`MboD}oGpcJwqG~RuuCcz@ypIjeA{F_eAkkGlnAwtEkmFgiGtzFi~Aez@jG{pG{m@w_AguEceAm}GaHuoOzoDanIrIm`Qx{IeuKrfD_`EekCwmF|SudD_rAg{EvwAi|@byAkdFeT}uFhsCsgE_e@cdOpk@_rCijDmz@kDsaEljFezMzeF}qHyrBohCpeA_iDaDcwBg_B}dFuxPtUulCwgBijL||DwnKxUslCazDuiKjsAocFxaD}nD`wCmkAlzCjVlqGgnMtE}eD}wC{dNaoN{cCqfMsfKwhCgo@kfyBpf@we]j@z@wl~EaJcydAtN}rz@{e@yakD{CqiwB_H{~p@bkAafE_Ay{wAq[sgxDzhbE_CpojEqF|zeApK~{|CrIj|oBb@`crAbDj|`AsJdquEeWdc@nxqGtKb~wBivQvby@qpvBlv}JgsuA`pbHmdXilAanS{`PmwAoy@cg@qsBt}AcrPa{@sAuHidEefAr@UsfA{hAfD@esBq`Ad@a@{pA_gBd^sgCkv@}|E}sKqtPz|AydGkq@_wHneI", 
      "zoomFactor": 2
    }
  ]
},
"US-CA": {
  "center": {
    "lat": 37.268975, 
    "lng": -120.081666667
  }, 
  "code": "US-CA", 
  "name": "California", 
  "polylines": [
    {
      "levels": "PIMJIKP", 
      "numLevels": 18, 
      "points": "cmfgEt|wqUgxOf{P{dX`dPo|AgnDvnH{yDdz_@mfd@tpAfoL", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKKJNKJP", 
      "numLevels": 18, 
      "points": "ujhjEfgaqUckB|p\\ioQfaDg|AhtMu`HrnFhsLkkl@r}MyfLlgD`z@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PIMKLP", 
      "numLevels": 18, 
      "points": "oa{mElya|UmvDtjJ}|Ox{L_|Dmmd@lfQkhO|iIhn[", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKJJMJJJMJP", 
      "numLevels": 18, 
      "points": "{yhnEjjtyUsRbiYsaFbdG_iDe}AuiDrnIgcBcuJvoIm`f@gvEyrQlcCitHrnDvdBr`Gfy`@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PLKLKKJKJMILKJMJJKNJLKKJLJJJLJPJJJKFJMLJJLJKLJJKMLJJKNGKJLGKKJOFLMJILKNKKKKJNJKLKJIKJPKKKJKKILJJLJKJMKKKKKMJJKJJNKMJKJHOKKKIMHKLJNMKJLKLJPHBHHFHPFBEDEEDPEFEHIFKIBPIHHKIIGIKIJHJHLIGIGJEINIIHHKHJLIIHHJHHJJHHILGHIGKNJKKHHIHLJHGHHJLIKJHPHHIHHIHJJHIHP", 
      "numLevels": 18, 
      "points": "qsqeErq{iUstb@d_MhqU_nNizMnWavJ`oMxnJ|sHql`@~fF_fFm}Dsrj@zjMi}Vt}Nyi^zpc@k}cAtnbBycDjiZrtLtzF{vEvaVgfFdtCoeF{}FoxLptCic]|iXvuBbbo@mgCfp\\awSbbu@o|PbzHyuYpfi@ybGnaWtgAtkr@kbJxvZ}~@fcXvvDdv|@_lNpkIo}HfwX_vX}vFi|IzzDeuQ_rCelHdhJemLcfCs}RikDovKhfCwoLhpj@mxHbjCapS_qEejKp|CcsDpxUsv`@je]ytEbdWkzYrnJskN|vU_zy@run@iqW|qd@}zt@hgMigJeqGnkEgrGg|FsnJgj`@yeH{bEn|DsyT||PdzAdva@olIv{T{tSlwRezX~iZ_cUu}CgyWjeIknGjpKmsa@wm@ycO@o_Da_RfhOksIhmCb{BdbQsh@vu]wxs@cr@igUucFp~Uwmm@|ySmmGd_UacUi]}lBrnKsoKdr@oaGamOugGarx@jqEo|y@gfKo`Ggq@mxNl}D{l@d@}hCoyHp}CirCysBt~F~qScfMdb@t_Sd{Uke@loVg_Lb~NrjLdko@cgPt}FuaHhjGdlAroCfuEumIlaKumAcnKppW`hHb_ElAjtJ{gFdwFtvKcqIl`LlfEb~EgsK|~HnlHt`RmeEtjAbfJaqOrl\\fmAj}C}bUjnXonCtiRdxFj|EeVhqIo_^s}Lwb[byIfRlqIqfZteM{eUlma@qah@dck@ms_@pte@mzUioFowz@dmXozf@cpJelYnsDqeZ`tIcs`@pb`@g{Rh~Ogu\\b~o@qtMox@_`Th`Jq`iB_iv@ml\\rzFgcc@cgNae[itAkps@bzOytH`iRi~Lo}Egd\\sEj\\qsjAq]cwz@gZmzw@~GuavDbg@_ucDrh@_gnBqHiqjDxo}C|P|p{Ga@|bu@]twXmCdz\\l@tgIcEliGxBtpLR``M_uS|yi@ig|@via@kdq@roUyn_@bqeB_qnCpzrAa`pBre`BcncCxdzDs}wFncg@iuq@|rzCaicEzF~dAxpIkeAtuCbz@vqG_S|oGqcJl`McoD`dAafB|XmlD`yE_hEriRanGniAdjAf~AmxCveHwlExrJ~j@tkB_m@b]eqGlvBayD`sCuxBbh@w~CvzFoxMvrDcrDzgCqwB`eGsv@fb@fyCtwNrwOv|A~tH~yD|hFppF`aP~vCruA`nH~]zsKrlP`nAlm@bjDqjDdcKjmC`bCyx@rbBvy@jrIofBfqDxb@rxEizAf_Dv}FtjB{dA`nG~JdcGtpAt~BubAl{HhgJvpCxcAplBxnChuDfz@|}BvyAhq@`rNpmJkdCzbH|eErjF{gJvrDr}@tzA{n@jeJaKnwG|bEtgDxJz_JggHia@mtBvbA_eA`h@guCc|@w|Hrw@koF~vHoeIxdGjq@ptP{|A||E|sKrgCjv@~fBe^`@zpAp`Ae@AdsBzhAgDTrfAdfAs@tHhdE`{@rAu}AbrPbg@psBlwAny@txRvnmG~iO`mfE", 
      "zoomFactor": 2
    }
  ]
},
"US-CO": {
  "center": {
    "lat": 38.996168, 
    "lng": -105.546535
  }, 
  "code": "US-CO", 
  "name": "Colorado", 
  "polylines": [
    {
      "levels": "PDNDHGDFGEEHHFEFPEFIHEFFDGGPHDGGDDHGFEFFPEGDEGDFEFCDEDEP", 
      "numLevels": 18, 
      "points": "azvdFzpymRzyp@iNbrlA_]sz@brzDwF~sNb`@pzqDzFhb`FxBfaLiKhv`BdMzku@|Cbx|ApKt~jA}z@~tDvHxsdBwFh`KmC`xnDvP``cCszzBaQwbq@}Mozr@r@{}PllA{wo@}JmehDyNou]dLceZcEa`kBaGkywA{^ca`AnL{]is{EfSi`wBnImttAuP{vgBnFipWjVgrsDzK{fbAwv@mlkDfUes|AeCo~c@tLwumCaL}`EjLm_oBlxp@uCh}G_E|~r@|HvgPMhcbA|Wz_sAaLxc@aChdtAwD~oPxEvgbAwGp`NB~wcAwKpz@fBjmdBaLxcQ~A", 
      "zoomFactor": 2
    }
  ]
},
"US-CT": {
  "center": {
    "lat": 41.5228965, 
    "lng": -72.7567405
  }, 
  "code": "US-CT", 
  "name": "Connecticut", 
  "polylines": [
    {
      "levels": "PENFCJJJJHHHHHBFIPIGGJJINDKJKKILJNHLLKCP", 
      "numLevels": 18, 
      "points": "a|l|F|kx_Mk|ZyqA{piAulEndActtAx@evFtNi`d@~aFtFc^cxH_eEahAtSuq[jo@sIlFaaDgt@waA_CylKfZeogAxBsaGzo@}cx@ttAc[rev@}z@`rNfZv{FcNhfc@lmAxiAjmGzaK_x@xfB`cA`OfuBdcG`_pAct@zwGklLhdIptNq@~xAxb\\yf@xbiAlhTnre@pw^pdjB}wArBkcP|}L_qTogo@{dOzaM__Mid@aw]{uA", 
      "zoomFactor": 2
    }
  ]
},
"US-DC": {
  "center": {
    "lat": 38.8908785, 
    "lng": -77.01662
  }, 
  "code": "US-DC", 
  "name": "Washington, DC", 
  "polylines": [
    {
      "levels": "PLMHHGJHILJP", 
      "numLevels": 18, 
      "points": "qtylFpr_uMp}Mk}Qr{R|eYe`Du~@s_Bb}@ow@}\\cuCiG{rCbsDmwD`dA{eBbpGq~JqtN~fDotE", 
      "zoomFactor": 2
    }
  ]
},
"US-DE": {
  "center": {
    "lat": 39.144846, 
    "lng": -75.418355
  }, 
  "code": "US-DE", 
  "name": "Deleware", 
  "polylines": [
    {
      "levels": "PFGEEEHMIHIKHOGKFIHIGLKMHKKJLKLO?BDLP", 
      "numLevels": 18, 
      "points": "{wijFdpamMm~PxU{gb@vuAcy{@zmDwvSpu@skHxQu_Pdq@upaAbtBiC_dByyHivDq{Gs|HqnBm|HiJmyJxsAadUhkDotHnx@ou@`gAhbB~{AtkEpeC|xA|fCnFt_@brAd|RzsV|~GiiHnbS|hDb|QkqMdjT{aUv`c@u\\`zJofMl~K_iBvxY}yUjv@{`TplcAcgF}AljCcB|yCw\\`fq@ap@~ccAcmQrr@", 
      "zoomFactor": 2
    }
  ]
},
"US-FL": {
  "center": {
    "lat": 28.133333, 
    "lng": -81.631666667
  }, 
  "code": "US-FL", 
  "name": "Florida", 
  "polylines": [
    {
      "levels": "PKJKNKP", 
      "numLevels": 18, 
      "points": "ghiwCzxzjNyyp@ezl@w_JimCgqDrbEelJ{{Thle@xvStlf@|il@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PJMKHJP", 
      "numLevels": 18, 
      "points": "cru`DbtatNe`\\`nFc~FphHc_AstIt_T}eDbhPuyErUr}D", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PLJNKJKP", 
      "numLevels": 18, 
      "points": "y`xjDzg~jN{}m@vpUije@uiEovBwxExiDwuGlp[rmIvoWjZts]q_K", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PJJLJJLJJLLNJKP", 
      "numLevels": 18, 
      "points": "ytklDzwzjNgThsE}pYcsGoxInfC}zAt{Jh|D~eEk~DphPslLfa@cuBk}Hc|DhvBbpNo`U}xWlpOv|d@{p[zvW{nIvqIt`K", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PFIHNHGP", 
      "numLevels": 18, 
      "points": "eyunD~uwkNunExjDeiMroIq`VxlMelJp|Cl_AmjBvsLcdFlrf@gvW", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PHJIGHGJFIGOHJGGP", 
      "numLevels": 18, 
      "points": "{caxD`jssOoeAnpCck@mYz]ykOyhBmgKemBa|P_jAwcVsqBgrQoYqgGcaAaj`@no@}xOhb@}iAno@v|@ix@nfg@|iAjrI`UdcG~xKpsnA", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PJLJLKJMJLJKMJMJKIIKJMJJMJJMMGKKKMIJLGLDJLMHKDKJJJJKJKNKJKKKMIMJJKJJKMKJLKIJMJKKLLJJLLJMNJKKJJNJLLJKKJJKKKPKIIMKKLJJLKKJKGOILJJLKLJMJKJJJGMJKMJJNJJMJJMKHMDJJLJMJKKIMLKMJKJLKKNJKIJKHJLHHIILIIPGEFIGFGMIIHJHHJHHAMBGEIFFFDFDFFMJHIJHNILIHIJGJHIMJHJHIKIIJIHHGHIHIPJJJKJJJLJIIJGLHLLJKJJHILIGLIJKIJOIKJKJNJLJJKP", 
      "numLevels": 18, 
      "points": "qhkxCfrfmN_Vt}Zu}DnuDejSf}EgcIcmGpwSgeXjiAkyJesGm~EixMtoJ{oMr_`@sov@~mUgvDelJibQt~IgxTzrt@wv@bsc@s}MumAytTjkPcz`@tvBiiHx|E_~Sx{AanDheNkvHbbD}lB}tF_bTcuGocLupTtaHz`WlaU|fHvaDj`Nmid@vcK{~He_BknRefBewIb_H}`GexS{kLokA?htAnwI`{BxuFdmZ{cLpjS_}BnyCreDwxCjmOyyNfcWulCotJ`qY{iR~xKcuHbjGf{HiwDvsGq{CyoGpbFuqw@`xWopCfvClvH_gB{mKtyIqfJsgF}uIdlEy_PfoVaxD_eHr|@hgDu_EhbBv`H_xd@asE`aD_cA}~Oz`An~[}vC~iKmcBgoLqwD}~AbhDvaMwiIqzOm_FxlAqy[w|[gkUwa@csErcKxaVfiC_y@vjDclSnpD}dQ~xSnfC~^yrFxhHx}Ea_DvzErmDzu@m|IpaDpwNdcKsn^bzDfrJ||X~aCh~@tqEkfW~pUhzToyKjfEdoAyd_@pdS{}}@cvKy{p@osSorr@whFuqUdzG}c@kwGawLRweWzdVor[vcHsvCbyl@azOlgFosExiLiqDsnE{_BfyKasP`tJcxOtm[wf\\zzCifLdl[g|`@hgSuo_@t_}@mkCbbSzpBrhM{cDrsOnoFjrVn_Qpg@ayA|aNphEu[nlAokQbfFxp@sxBd~Ufub@fzkAmaEpwLziJntJvqBpfk@zrBfi\\{hQnvGkzOzZelAubCnyNtz@lcSauGk`As`IobT{d@ogUrmO}}_@drn@sb@yuJr|Mk~Qq{@c_JwwApkBfeCquH_jAGgjClpAdm@~kLgvNvwKieHrdb@ufMqpGhBuzK_uJ}~D`~Gzy[cfEj}EpfBtaRbhH}~BdWeaMrpR_dE{l[x{q@ubUzemAojCp_VxWq{Ufe@m|[_rDnH`jGgxWc}Fzr@w~Jd{Qp_Dvz_@esFtsK|cN~w]pb@tdb@bgK|umAedTm}q@}|Hx~N}yMioDnQvoErvYpuHahUjxIfj@zdHjbQsfAx_TffUtqEri\\_jNs{A{uDieKm_DrBkxCl}LquHzdDy{CqpCqlK}rDojHn`@}yCp}BepAx`GyiGl~KogFp~AkfKrmMuqDd|@ecN__FslHlu@iBs`tA`^m}iARocN|g@ab}@aVipf@zJif\\_o@sniBq@ev}AbhCcHz`BceDncFo[zgEebEfkHybAxsGdb@zdDmb@nhCcgAt~@ahDvvDgsClJ{HbsBol~A|U{bQ~hAcgg@~QurM`}A_jr@t{@_dX~eBihy@hE_y@riAo~_@zhEgijBtf@{kVt`@_~H|~@cid@t}EnkB|pD_vB~oA_}Bn|Kxf@dxIi}Czl@o`BsNezTo}AcyAwwIlo@cv@qcAuxE{mA}eQmgBclDbp@keIhbEmySmpA_i@euBchD~N`pAwsEkmBq{BswCit@{Vsx@hbAwaFu{Ais@tuDmbDtcAisLtdDqdDiq@yuBxb@mbCvrBi{BzdBioMyOuyAp_B_pCqt@qUlqBsrK_|A}p@x~VmyD~gG|wB~xRwyJ|nMnpCzpCsiFbqTs`Avd`AmkXzjOvtApyPmeMvmLq}@lsm@geWfiNgoAftmBcy{@hpHgpCovHnrL`BhsB|ojAafS|gfBkxp@`uGziBa|B{jDjwZ}uNj{[}qGzyw@}~UnlNstHqvDxrEecDhyKij@dgFh|EibFp}@coL`iQeiM|jYagJh@pvC|na@cmKp}zAdrEjccAflGhni@fwKfq[ddTjdWlqDbjPenDrp\\xlUngJ~Wq|B`rXbvJdvZioEty^nwIdgV", 
      "zoomFactor": 2
    }
  ]
},
"US-GA": {
  "center": {
    "lat": 32.6808145, 
    "lng": -83.251855
  }, 
  "code": "US-GA", 
  "name": "Georgia", 
  "polylines": [
    {
      "levels": "PJJKFMIP", 
      "numLevels": 18, 
      "points": "qhnzDdidpNy~BlsCcbWwz@geCxoEkiCaqB_`LalLteEorAzlj@bhI", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PHJIHJMFFDFDFFFIEGBJAHPGHHJIIJFHJHHLHIIFIHIHKIJHHBHMGHJHFHKGIJJHIIHHMHKHIIHKIJHJHIIHIFIIHLFFHDFEGHEDCGBPADFEGFGDEEHFOIHHIJHHIHHIHHJIHHIJHKIIGNHIJIHHGKIGILHIHHJHHJIJFHLHHIGHJHHJIHKGHHJGGIILIIJJIIKIIIIHKJJIHKHIHJHIJHHHHHIHPHHJHJJIIHJHHIHHIIHIKHGIHHHJHILIHJIIJIIJJLGOJKLIJHJJMJJJIJMILKJKMMKKJJLJILJJLHLLIKKJJKJJFMHHHGIHIJIIKIHJHJMIHJGJIHILIP", 
      "numLevels": 18, 
      "points": "}|hxD~wntN{l@n`BexIh}Co|Kyf@_pA~|B}pD~uBu}EokB}~@bid@u`@~}Huf@zkV{hEfijBsiAn~_@iE~x@_fBhhy@u{@~cXa}A~ir@_RtrM_iAbgg@}UzbQcsBnl~AmJzHwvDfsCu~@`hDohCbgA{dDlb@ysGeb@gkHxbA{gEdbEocFn[{`BbeDchCbHwkNd_BibHtbC{}Ef~Dq|@hyCkyC|z@o{Dmy@gtG`|@ydEkiCyuDjGcyEr`@}iM{dDm|Ep]goGorCaxEB_aLnfBshKpcI_wCtm@wnCgTqfH`|A_^tGe{L`XkgIq~B}hMyxGedFqrA_kEd`@uyBm`@ycCm`Am~Enk@uvFysDymAmfBqpAqgH_~B`_B{b@agHaaAklAwtB~n@oLmqBc{@}eAwz@rBowCndDybFpmOklBgSqwCe}Dm`BdoAw{@qsAakEya@s}CtwCqoKjc@odKptM}fCrrAa~CrLclBflBa|DkrAkuA|jBstGfe@k}@|cAsiAps@u`Cq_@y|DxtEkqKbrB_oo@zhI{w@dA_}x@zuJmsKvdAcb_@j|Dq|o@noHasIhhAiyWdaCguf@dpGknl@jaIm`KhvAgkFjv@_zm@fmH_~W|`DFysZZo~SfDm_QaUcqy@_@ou_@~KavDlKyw\\aAcrx@|Ccdg@iFseb@]w{jAqNqbFor@cmnAddBqb@fwDf}Awe@rc@tg@`d@`qB}wAc\\hmAn_AriAiJblBjzAxSzj@zsCjdDhdCg^nbB~~AprAuYd_AdaBam@hkAhzAh`AV`BlkBzuCtMvz@~jEfqBn{BxyErChzCdgDzmBdAvfEccAb{As~FduH{aKzxAuaMdiCad@~v@}eChlEwuDfcB{tDvsDeuCdwB_eHob@kaDgHw_Nv~BifFlwGutCfcG{n@raEcmDrsHq_Dvz@{sBlhHme@xlDm_Bl~Eqi@`_KmvMvkM{eJrcCmi@fuG{kC`{@xQroDgpJ~hIu{JhoBsgEfe@_sEfpBqzC|BayAtcEezF~cCab@lbCqtFl|LwbE~z@i`CrbJshCzt@q{CddC}nDkDelCraC}{HvcDuhDxu@_rB~pBorC~xDs`BfzBkuG~yBmzB|}AnaAj`CqtAnl@dfDndEwyAsBhwB|eDcs@zDe}CbkBhC_RksBnpDyfBgv@weAxl@_~CjeAx_CzkDitEgWxqAjnA_RziBhjBriBamGvrBmx@_z@yfCvTg}@trBi_Ar~CzVb|C_oC~fCo`FdzEgfQviBs}Ah}@u~E`jBklAo@{oBpaEgaCzp@ccBdyGf_@pYriAdr@nAjuHonE_@ajAdfCrpBj\\eyCrfDcS`QunC||@gs@tfArf@pbAez@zpCvy@|vDowAfj@nj@~p@i_BnzFtoA|{AmrAf_Feo@p|C|mAxxD}hD|m@qsBzf@tAqH_~A|jAkdAnX{aG|lAgyCpaCof@drAieEh}I{_GpsGz\\hpEmfC`}AlDnmEgfCy{@o`B`bBo}@x|I_p@juBxuCznEaBrrEamE`gMnZ`kA_xArlRi`h@ziJnkN`gJuOjaDb_`@wbG|yFbc@fiDszBe}@kt@hh@j{Cr~Eq~GxuG`uI_uFgaDioF~jDdtAk[exF~rGkqFl{Di_Sj}GthClzHrxMqeMjgFn|AvjCpqHmcCcnK~jU|~\\qf]p_HpeIwzFrmIrgOyHhbImtG`nFhuAbgXblSoj@fgIvmExvGdgHk`BsmEgd@hdC{dP`nEvy@zhQhyLjnBbx[ruGqR~iG_wHwlErvJjwPuuG`sCvjFpjBkpGvsNxtGl}Sc`Ej`Fz{D~{A|p@mqBrrKpt@pUq_B~oCxOtyA{dBhoMwrBh{Byb@lbChq@xuBudDpdDucAhsLuuDlbDt{Ahs@ibAvaFzVrx@rwCht@jmBp{BapAvsEbhD_O~h@duBlySlpAjeIibEblDcp@|eQlgBtxEzmAbv@pcAvwImo@n}AbyArNdzT", 
      "zoomFactor": 2
    }
  ]
},
"US-HI": {
  "center": {
    "lat": 20.575447, 
    "lng": -157.51676
  }, 
  "code": "US-HI", 
  "name": "Hawaii", 
  "polylines": [
    {
      "levels": "PJLKKJJMIGLIKPIGLKLKKOKJKIJKJP", 
      "numLevels": 18, 
      "points": "atnrBrpbu\\}fPn}TCvtNmoV`lHg`n@ugEs}TtbMaf[juCix\\vbMyyFmpKo}TeyQsbMa~Ic~Ibq@o}Td~I_yQygEjpKqoVnbM{na@~sY}peApoVkkSlx\\muCmcBayQ~fP?d}Tgac@ztNpuC~yFl}T~fP|fPfpK~sYtgEhx\\n}Tzii@ttNfcBtoVzaX", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PIJJMKMJJP", 
      "numLevels": 18, 
      "points": "amo}Bhq`}\\kpKpuCyyFeq@alHvbMalHkcB?{aXzfPkkS|kH`q@l~ItbM`q@vtN", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PIHLILKNKIKJKNJLIJIP", 
      "numLevels": 18, 
      "points": "kap|Brfqy\\e~IxyFgkSruCmpKrgEncBvgEygEn}TkkSf~IckS}yFquCg~Ih~IqbMzfP_lH_lHuoVhcBayQxaXmro@`lHmuC~xQ`~ItgEzfPcq@ppK|kHttNjcBroV", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKKNJLJIFKIHJMKP", 
      "numLevels": 18, 
      "points": "adn_Cl{p|\\e~Ifac@luCtii@e~IhcBmuCi~IobMicBvyFkpKdq@qj^i|@wxAexAgrEveFg_Bv`@wtDfy@eX|_Ceqd@rbM`lHbcBroV", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKILIJHNKJMJFKJHLJIP", 
      "numLevels": 18, 
      "points": "qju`Ctjhb]wtNrbMluC`lHjcBhx\\mpKxgEqoVfkSkpKdq@alHpuC`q@ox\\_yQqbMquCg~IlpKqbM|aXipKnbM_zFsuCalHtbMalHzfP}yFnuChq@cq@xyFtgEhkS", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PJKGJMJIP", 
      "numLevels": 18, 
      "points": "s{_dCdoxp]yp@~yF}fPscBocMikSgzF_lHbcBquCzbM|yFvlHvtNvbMxgE", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKJJNKJNILIKP", 
      "numLevels": 18, 
      "points": "ibndCbpcl]mcB~sYmpKjpKicBdyQqbMlpKo}T}fPyoKetYqbB_ac@rgE_lHfbMalHftNtgEvxQdq@vtNhkS", 
      "zoomFactor": 2
    }
  ]
},
"US-IA": {
  "center": {
    "lat": 41.9366875, 
    "lng": -93.391755
  }, 
  "code": "US-IA", 
  "name": "Iowa", 
  "polylines": [
    {
      "levels": "PHJGHILIIIIKGGMHHHIHHJJHHJJJFMGFGCGAFEFDJCEFBEPHJKHHIEKHHJIIHKHJIJIIJKEMGJHHIJILHIJIGKJHIKHJHLHHJIHJKJIKHHHKHHHLGJHIHJIGIMHIIHJHIIIJJHJEMKHIKIGJJHKHJIPCFADEEFFBEDDFBDDFEDPIHKHILIJLHGIJHMHJEHLHHJFIKHIGKHJHKGIHKHHHOGKFIKHHMIHJHJKHGHIJHNHHKIIGKGLHHKIP", 
      "numLevels": 18, 
      "points": "}gmwF|{ckPjpCdx@n`DjoE~lAtfIvYreHt`FtdUl}D||E`{C|IzxBg_EfzCul@n_JfaArsG_nAlaAfpAja@tmEn|A`yDevBvoDh@`rAuxAz}@i^viDwzC|Jye@vx@mwAgb@_s@r_Hu`Cnh@g~Bv_EenDjb@itBvqLqwDgLmkAvgDceBryClHb~f@`r@peo@hB`{_@rq@xsv@fJb}Lf`@nyiA`Whrs@_A~rd@zMdsj@rZlgl@`Rb`j@gSveo@sHne]eHtyu@g\\`~x@gN~f_@m\\xdjAafEa}@}iCh`Au`PzeTocKezCk{Im`@ghCgjAq_ElLehMpEopDrpCciEoG}_ElwBwmGi_CyvI`rBsOqhBotAwBqsArbJeuAle@ukBmeAa_NhwBag@}uB~eCatAwyAat@ypFfoIauIwPkeLe^o}@dpByz@vnI}cA~g@yrBygBsfB_Pot@jaA~kAz{GkqA|}Ee_Dbe@ioAmdAynCn}D_{I_jAyvD|aCqbAbK_~@_dFceDzwAydC{AsoFcnCs{L`qJsbGbwCu`CawAmaG~GcyAzkFsbBbmB_\\xnE{hDlO}~BffD}pMxyBqvG~aLs}GzeAu_Bg`Dm_Eq^agCz~@ubBj`Dg_EvbCc_C|uEudEolAurErc@ygDkzB__DkJogCxmGimDh~FcdHxw@q|@pgAih@ylA}rHdwCckE|oDce@vgC_xFxkKqzFrwAmoDio@_mCsgE{~EuqAlEwyA_lAwhB_yH}sB_iBhi@uoFivD_tEvL__DgpBsuFdbCy_Au{FstAilBwkA_GgoFcy@kdO`fCcv@fwAkn@`}LmwAjs@etAmm@s_AvdAmdDps@}lB_pFcsHomBkiDpLcfB`kEqxEfcE{`He`@aoBvyAXs|YjFk_mAqAi|d@wBipmA}CmiL~Dq~{AaC}yJ~Ju_nAgDyug@oGght@{Aqp}@v@mz\\aEievA`@yhDjEoszA~CgnS|@ujhAsA{xbAqEkhVc@aujAv`F`lA||Fc{CrmIgnApfBmcC~|F}fRzjEmjAlmCjOnpT|_QhsK`l@rIcv@drNan@lvM{pAhsIq|GnePifAfoFabBrkFuaLxcDqqNhN{fDvcCku[dvBs|Hz~Ka}D|`Bg|CthDmsA~vBtnAtzA~rA`vBkTf}AwhG~pFagGrmEkdMlrD_tHlxB_vAl~Ms{@|cCqbAviEquFpoAwrG|iFcbQnfFauFrLw_BvgBaz@ziGbHpkDwlBbtHep@nkI`iA|iWdaGlwCxrJ~|CxtHzqEbcChkMj}Af`HeJrbBjw@hyBpqMbsCviAfcBd|BzHnwOjeBduJlfHbjJpkAxsHn@b_Mn_@npKdqClrSo|@`~Hhn@jfDhiC|oDn~KhlBhbLttDvaFeDjxIoyGf`A}lF`eComDbyFmjElsEsR`lVzd@beD`lCbtGb{Kr}GbwFbbM|Vz}IjiD", 
      "zoomFactor": 2
    }
  ]
},
"US-ID": {
  "center": {
    "lat": 45.497265, 
    "lng": -114.141846
  }, 
  "code": "US-ID", 
  "name": "Idaho", 
  "polylines": [
    {
      "levels": "PHKHHIHJHIIKKHHMIJIKIJHIHHJLHJIINHHJHHHHKJFHKJIIHIHKIGHHJHKIIINIHKIJJHLHHIKIKIIJINHJGFHBFGGOPFDMIHIHJHJIILJIKKIILHIIHOHHJHHJHHHLJIHJIIJHIHKHKJHHHKMIIKIHJKIIHINIHJHKKHIJKHIKHILHHJHIIKKIJHLIHHJHLHHKIJJJPHHJHIHHLJHJIHJHHIJHHILIIHHJGNJJHKHJIILIHIIIHJHJJHHKHIJGGKMHIJHGKLHHHIJJIIJIHLHHIHNIGJJHHLHHHHILIJHLIHIHJHIHHIKJHGHJHIMGJHIKHJHJHHKHJHMIIHIIJJHIJIHIIFPFGDFFPFHGGGCFEPP", 
      "numLevels": 18, 
      "points": "y`riGhugiUwqMsNgaHhrAicEiz@kr@_jBoqAtb@{f@i}DgwAun@q`E?yuCcrBmwEnr@u}HyuEctJdmGoeBqrAaPofBalI_vGs`EpbAm_C`mLyiD{b@ygCrfBeMhjFbnBlfCykAnvDepCxvBcPxjAzvBd~D{OpjDccEvjGubBfWiqFabB{zHv{EwkFczBayG|k@_oAw~BuaDsfBumC{fGayCuFuqA_sAayUu~Hkr@goAgaIkgDggDoePsiIudGqyBskAm|Bi|DaaI}dE{wE~jAenB_dBpDtgBkr@jo@o|Buo@shB`g@alE_fHoaDs|BisC_x@si@ahBw`EkyCqlWqiHqgMkfB{hWsxScrEmeAqcMuyMgzFyq@}jJbuG_`HnrAkdFfiEonE~hQ}oFzoHuBxwLabDvlB{gJpvKw_NvcGszAzaCuwLdpFeoAfwDetBy~CkiLihEmgEzlFmbIv_@ckIvsDcmEncD_rAhaFexFezBiuF_d@yeT`T_ypB}D{dZzGmbSuBgavB_ZitMtGktyC_|@qr^hQEed|D`|`Bui@ttw@oFvjl@qKjeAaoDvwF{cDpiJ{|JxaD_sEbtAetEdjC__CrpHsmApfAy_HjzEq{ArwA{eG~zIlAvsCs~En}Cue@jcJb|H`oAeaG|bEuu@jxA{gI`lB|Qvt@toAfWl|MzeAdmBxfAj@vpCakOlvBclDx}@itFd|EarGliG{iEp_AacCll@quMlbAerBpt@krKt|@grB|xKetD`zIycSjdDq_Cjc@{sCfoDiqAjfFqqIhkIu_Dt_AiqBfYq~E~pEgeFvoBw|FtdBveBhoF~o@hjI__H|Mi~EleCi`Dhw@gcHpbAedBfhIv^jp@qxEmpFouH}DkxCphHwjHddBlvB`~@{@reE}rEiv@gwLpxA}zImiC{lGgbBofJ`m@ksHdcEi}@nyEhsBnwLni@leAt_AdtB`yH|pJyeD~qDdpAlh@znAhcTnhCjeEleGlx@}D~qCaoEp_IhGrtAjbDmLfiGndCfy@l{BglA~u@quD~{CkdChcEv{@fjDpqDhtAuzBv{B~|@lnB_aMloBwk@bjEbvCtbAsbBpwFi`CtwCxzAoe@b~EfqA`~DcSn}CzjExpBxhHr_HpeB}eCvnCuj@vqDwhFd~BbqAjfC_w@tnDhhKfmDgsCzhHx{Baz@spEbgAo_EoFwrEh}BeuD|qDuyA|qAohHtjCqcCfd@wsCupDgpKyiBwxAeiEwc@`m@}eH_cBmiCig@{|Fu`C}uAk~AyzEgqFgdDu`BooFihA_k@g{Bnv@evA_`A_dAqnFloByj@br@_iFncBwRvnBkdClsC|EpWo_Ixv@uwDthB_tBbmLfzDgK{hIh|@_u@jvDqRngEbfBr|EoaAtlDwqEj{J}LjpGyyHz_BxGxyIiuGh`DcvGfbEui@~}AwkCdhBlPp~@ciCy@weG``Dz_AxbAi}DroAaWp|A}_EjbBjTxuDmnBfoHho@tu@rzAlFntCrv@hv@noNk{HrlBevCfbD}|LrqDwy@uFehCe|Do_KkGehB~yHy|RhuCybAxiCy_DjwBePl~Bi`Dd_IytB`cGtrD~cDanGvpCqJvjCe{DdsDvmAfuDktAb|Ap`@rLifDbpDqdHrxAq}H|mCifBdeBsdDaaA_gDi~DdGccDzp@yeFk}DmbBieB_`Am_H{mAcxBxcBc}JtSsfUpyAiiFmc@wmGdyBakF@gkImjHygDomD`KufB_wJeqBm_D|AgcDfbC}mA`k@gpB|RsvMt}@yvC{_Ai|F~b@{hEgkAsTp`@e}Gi|B}hF{g@igLxeIcsKoyAe~AiAq_Dk|A_wHeiB{gEpo@qpNw|@slF~uCe`Nom@{n@aJipCejAzTwF|zDqeGdfCkmC{nAwfCbd@yQqiFaiAiiAelBbNudCt|BebAq`@{cAueE|YonHasDe~@im@cnAduBqjCmIg_ErlCkVbjCyzB`x@c~CndExAr~AwbHxv@cYj_BfyArvDa{A~r@s}F|yBit@~jBi_FthD}`@lzAiuE~nAclGhz~AgF|ezAuUlal@nCjvr@vIz{cBgN``bB~JyWvavAiLbjuBhSfbHaLhpcD|b@j~kEiB~~k@uBfprC~JvesDe@tfpEo}gIlm@", 
      "zoomFactor": 2
    }
  ]
},
"US-IL": {
  "center": {
    "lat": 39.748075, 
    "lng": -89.512095
  }, 
  "code": "US-IL", 
  "name": "Illinois", 
  "polylines": [
    {
      "levels": "PJJIIMKIHKHMFHJIHIHJHLJHHKJHLJIIKGIJJIKGOJHJIJHKHJGJLHIKIHHMHJIGJKHHIKJKIGHHJHIINHKGIEHIJHHKIHINHJHILJIJMIJHJHHGLHJEJHJIHEKDJPHHJDJGKBFKJGGKIIIIMIHGILFIKHHMGKGIIKHHNHJIHGHKJHJHIMHHKIFKNIHHHLHIGIKHHKGIHJHPDBGEEHEFFFPLJJJMFDEAGGFCCGDLIKIHIIKGHELHIHIHJHJHKIGJCJIHNIHJHJHEJHKIIKHIJHJKIJHHJHKDMIHKHHKHJJGKHIHKIIHIKHKHIKHKIIJKIILHIP", 
      "numLevels": 18, 
      "points": "{j}cFnnpxO~wE|dBzoE~uj@ppEtgHscAdzJbyBtiHjhS~oGdsFy|@tdIa|HxoHcoD|jJtmDvdDpcDxW|uAhT`eDiq@neGkaFlvIycDlnMac@b|HicAhm@_xHxxUkdBtoLcIbzJrtEd`MtkMtbInuBpwD|sD~oCvoFz\\niDouCp_Am~BjGxlKyfGnfBwnArkDszGxcDwXb}Bpc@dvB|wC`g@lnEe{G~uBaMfz@z`Co`AfoDavFz`MuvHoQgmFxpGsnDpgBooJ`lDewDcQeMxvCo~BvvCmqDB_xCgrAi}@}eE}dBimEsxI_r@qfGxaDyoFf`GotNr{DyqGmgAivEhc@cwDic@o|A|q@ueAnuJ_uFlrOsoFvy@eaC|}AgaFthFmoKlaWsAhy@`tA`c@xbB|qEkLdhForEp_GmbIi`Cqb@rgIgtCnaEesFxbNofCb_BmyEbfM}nEvaHavGn}EwgCdeH_|GjnDylPn[cdGqaAm~CgvBgcFakFyyPk`F}vAm[wzDy}BsgHwdJcnHY}bGtsBqrCob@arHinEmlAkoD}|AcsAezDwt@alC~yBe_KnuTy~@zyEe@`~F}hFhfQvRxaJheLvyJx}BfxFgz@rbJisIjcG}_SlgFk~BnH_}EmjBwzHtcDyaI`HmsDjwAeoC|b@gqHz`GgnIv{LkxHv_R{pGxgPywDfnDkvIvuD{rC`fKmgHbeH{wObjU_qFzsH_dFrf@shGzr@mqJrdLwiCjJufB}hB_|B{UovChhB_tJhyF_|JpgB_gLtjA}zK{z@e}Hqn@ckJokAedKcmFo|AayDka@umEmaAgpAssG~mAo_JgaAgzCtl@{xBf_Ea{C}Im}D}|Eu`FudUwYseH_mAufIo`DkoEkpCex@{}IkiDcbM}Vs}GcwFctGc{KceDalCalV{d@msErRcyFljEaeCnmDg`A|lFkxInyGwaFdDibLutDo~KilBiiC}oDin@kfDn|@a~HeqCmrSo_@opKo@c_MqkAysHmfHcjJkeBeuJ{HowOgcBe|BcsCwiAiyBqqMsbBkw@g`HdJikMk}A{qEccC_}CytHmwCyrJ}iWeaGokIaiActHdp@qkDvlB{iGcHwgB`z@sLv_BofF`uF}iFbbQqoAvrGwiEpuF}cCpbAm~Mr{@mxB~uAmrD~sHsmEjdM_qF`gGg}AvhGavBjTuzA_sAhEwsi@lYo}_B`C_kPhd@ixsAqAq_G|j@ibqAEk_a@vFclJmM_ynAvM_dS|AwrlAfda@tvF~x]o~MzzQqoP`oh@ciJjdWgdOtqp@jPr{_@i@b|WoC|~^x@ftr@`Cn~o@`[`fAkHp||@aA`nu@tAfhu@e@jwXtQfxWhIpkAbfJz_EhkD|{@kzAndBh_@jpCsv@xy@qjCvzFdXt_Abb@xKttAhkD`bFjgC~aDdcB}bAhjBnPrz@g~Dl|A_DjZ{tBpiCyeDx_LiUjId~@hiBuqGprAgyAreEqSbhDjw@`zEb{BniAmt@pdKkiGztBpdApj@ycAzmE|@r{Hj}EfuAruGpvDldFf{BrTdsCav@td@v`CtwBtkAfdDp|BjgEweCh|AlLiUxcDlkCtoAh_BpjKlw@|NrgAezB|jDdz@~wFl}E`_DpzHb~Kj`BrCxoAmcE|cAtFxy@b|Aj^ryBf_DedC{AcNvkA`mKbqIbf@jd@btEmq@~wDi|G|sA{@z_CbsBd_@hnCzpDrxGlcA{e@mZugHnqCd`AbwBnrJ~v@fs@ri@cIz\\szB~|C|m@lnE{m@ltB`aC~fCuCn\\xmC{wAnxAb~Bt^|d@ymI|hAaW~{@fqBq~@bxIzbArGzjDw_DluCkbGjdBjp@gVneHdtAeSpiAkzHfvLpeFpwEj}JjyFt_DhhEyItwGsqCrdMgfK", 
      "zoomFactor": 2
    }
  ]
},
"US-IN": {
  "center": {
    "lat": 39.7708685, 
    "lng": -86.4444695
  }, 
  "code": "US-IN", 
  "name": "Indiana", 
  "polylines": [
    {
      "levels": "PHKIHKHHJGKIHJHFKGHHKGGJIMHIHJGHKILIHIFHKIMIHIIFFKIJMJIKILJKGGIJHLHJIJHGLHEPIIKHKIHKHKIHIIKHIHKGIKHKHHKHILDKHJHHJIKJHJIHKIIKHJEHJHJHINHIJCJGIKHJHJHIHIHLEHGKIIHIKILDGCCFGGAEDFPJJJKLILDBECFFDEPEAFDEFEDHA?FHBEKHHKGHKHHKGHKIIOJCIGKIJGIMIDILHJKHHKIFILIJIKHFIMJIGKHJP", 
      "numLevels": 18, 
      "points": "_o_hF`r~mO_cB`mCmHxtClfDqFxlAyqGbgAeo@|{@zt@rcAduHf}AlsAseClzGvB|kA`lBjz@xnC{eEjnAIdhBjbB~m@tvGv[xbBfpDtu@`bExQtyGevAxxAnc@vf@tqB{Xh}Fr[hfBjiK~eBxiAn_EsGb~ByqAr\\ceGw_AmaAds@lG|~BvjBlwFmV|zCuuNdqHwnAxqC~[~eFpnEbeF|`BvcEjm@dfJpc@tuCvgBxpCluRtxE`nClzEia@b~CugFvbD}gAtmBo`Ap}HsfCj~GcnCjkFy`Gf`NuHpsKpaCdgI_zI`mR`iHpmCjkEsiEn`DwEzbCfvAv`BrrGgr@jmEezJg^}OpxDj_@ltBeU|~Cd{BrsLinArpEiqEndGf\\zmCdaBtmAbtDxMzcFkeDnsDb}@p~@nxBxpCnvBa|CbgIiZjwCqiAjzHetAdSfVoeHkdBkp@muCjbG{jDv_D{bAsGp~@cxI_|@gqB}hA`W}d@xmIc~Bu^zwAoxAo\\ymC_gCtCmtBaaCmnEzm@_}C}m@{\\rzBsi@bI_w@gs@cwBorJoqCe`AlZtgHmcAze@{pDsxGe_@inC{_CcsB}sAz@_xDh|GctElq@cf@kd@amKcqIbNwkAddCzAsyBg_Dc|Ak^uFyy@lcE}cAsCyoAc~Kk`Ba_DqzH_xFm}E}jDez@sgAdzBmw@}Ni_BqjKmkCuoAhUycDi|AmLkgEveCgdDq|BuwBukAud@w`CesC`v@g{BsTqvDmdFguAsuGs{Hk}E{mE}@qj@xcA{tBqdAqdKjiGoiAlt@azEc{BchDkw@seEpSqrAfyAiiBtqGkIe~@y_LhUqiCxeDkZztBm|A~Csz@f~DijBoPecB|bAkgC_bDikDabFyKutAu_Acb@wzFeXyy@pjCkpCrv@odBi_@}{@jzA{_EikDqkAcfJgxWiIkwXuQghu@d@anu@uAq||@`AafAjHo~o@a[gtr@aC}~^y@c|WnCs{_@h@uqp@kP~cIw|Ks\\otGbqBrlCntCcfH|p@ql^ksPe|w@kqHy_TCen{@dCkww@p@en_@vEups@tDqhZ}DaweAnCmiSbEqufAtDqiFtkKzJxr_@fEd`SfBnc[yDv~DxB|ur@qEvtq@xNxjZd@~_m@dGtpEbDntz@dr@b|QbO|}cAp]`}HLj`h@`Excf@uB}EjeBnpFvnJ~xApS|mButAdhDkgEboCe|@znDdiAzgDzwDrpB_Cbm@{_Bj]g`J`oA_zAxmBsFbhEbfFr_Gib@vnAds]deBbtHtuAbnGxaF~~HnuB`aGaCjsGmnH||K~l@rlKwGzfOzsAbqDn{Dvj@nmT_vD`qCkj@xwCb|AvtBrsEfcH`~FryC|qSrhKn`Ed~GnaA~dFvhDl~DpxKmjAptFuVd~Bv|@loExjFrlA`mJjtJnnUxOt_EtcBxiCdlD|}@nkH`v@~zCrbDzbCouGteIcg@dvOonCp_KclBt~C_~BxtAw_M`f@wgDpqG", 
      "zoomFactor": 2
    }
  ]
},
"US-KS": {
  "center": {
    "lat": 38.4959185, 
    "lng": -98.326385
  }, 
  "code": "US-KS", 
  "name": "Kansas", 
  "polylines": [
    {
      "levels": "PDFGFFFBGGFCEDGGEFFDEEHDPDGEDEDCFEFDPDGEFBDHCGEFEEGDEFDBFEHLIIIIKIHIGPJHHKIHJIIHLHGHKIIJJJMHIIEIKHJIJKDIIHGMHAEEIEDFFCEDNCP", 
      "numLevels": 18, 
      "points": "czy`FpvgcQjDxj`AoAfiVbQfvq@gKjs`@zInkHaMdfcBrAlyk@fAd~jAzSf__AaLvdaAUvsy@mAjkn@fCtud@z@ruxA~TdptAuDx|SHjxwA}LdmPc@nqiBfFbx|@_DhsVxC|c}A|o@x}zAWhnAcrlA~\\{yp@hNycQ_BkmdB`Lqz@gB_xcAvKq`NCwgbAvG_pPyEidtAvDyc@`C{_sA`L_L}x|BcDysObIqxmBjEwzByGsfiBTw~@wNq_kBlTiyvAtFedUWsebAhG_fi@eGa}m@C}i`A}FiaUtMwxwArFarwApIa{Sx@czbA_A}th@cC}vm@jImaj@tDwawAsi@gbCbeJifLrWqoEzmDetAhLknGtmFmvHxSeiFueA}xDsvBghA_WuaJr\\kfD|bH{IpdB}mA|\\u~ChcAi|@trCpbAxcAbsEzl@pJ|lBgrAwPsvG~g@uc@p{Ath@lmA|lDu@h|Cez@hjCzZ~t@`eHzgBfoCvuHhaFhlDhrFaN~aDbyI`mDmj@|gHgsI|jCgk@tqCorIbnDelDr{DukE|BqjDf|FrpAxiB{UbfFceDvvCwhHd|HanAjwAi_Ed_D_sJ}UyvI`fB}tDli@}qE``AmfAtpDdj@zhLdFdpg@zRhoRfCz{r@xa@noNbApt`AyIv}CuBtmcA|NjwDy@`qw@m@zuy@zJjiKw@kVfpoAiCzsF", 
      "zoomFactor": 2
    }
  ]
},
"US-KY": {
  "center": {
    "lat": 37.8193055, 
    "lng": -85.7639
  }, 
  "code": "US-KY", 
  "name": "Kentucky", 
  "polylines": [
    {
      "levels": "PIKHIKGIHKP", 
      "numLevels": 18, 
      "points": "opw}E|}maP{_CdrEwlChF_eBajAsi@a`D~`@ygFzeAsfAziCk_AjaCn_Ale@sc@tApeJ", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PEFEEACHPHLGIJHLIGJHKIHKIIJHJKIDHJKHHMIKIHHHIJHFNHKHIKMIIJMJIHLIIKGJGKIIHNIHJIGGKJLIKIJLJIKFFIIHIMIKHFIHILIKHGJHIHMIJGGKHHGKFHJHIKGJHHKHIMHEJJHKIJNIFHKIJILIFIKHHKJHLIDIMIGJIKGICJMIIKHGKHHKHGLHIFIPIGKGHLHJHIKIHILHJGJGKIIJGMIHGJKHIJIHKHFJLIIHJIHNIIHIKHHJILIIIHKGJJHILIIKGGMJHJJHIJIJKIJHHLIIJIIPBKHEIKHIHKHKIKIHKIILGIHIHJHDNFBEHCIHHHEEDJEDEGDJJMIHP", 
      "numLevels": 18, 
      "points": "ofw}EfzjxOeI|owAkG~fBbBxey@kDx`BH`XePxycBOthLsp@lTcsSqsGmz@s_AwRscCvi@k|BhcHyqFjd@gdG}mAedEwsHe}@ufC}nC_sB{x@gdGjxDyvAmFkpEkvBvJm`Dew@}`DkwCjAajAzoF_{Cvw@wvAoj@ynCueFmaP{xCkrCrLsaA|lCq_Al~BoiDnuCwoF{\\}sD_pCouBqwDukMubIstEe`MbIczJjdBuoL~wHyxUhcAim@`c@c|HxcDmnMjaFmvIhq@oeGiTaeDyW}uAwdDqcD}jJumDyoHboDudI`|HesFx|@khS_pGcyBuiHrcAezJqpEugH{oE_vj@_xE}dBsdMffKuwGrqCihExIkyFu_DqwEk}JgvLqeFhZkwC`|CcgIypCovBq~@oxBosDc}@{cFjeDctDyMeaBumAg\\{mChqEodGhnAspEe{BssLdU}~Ck_@mtB|OqxDdzJf^fr@kmEw`BsrG{bCgvAo`DvEkkEriEaiHqmC~yIamRqaCegItHqsKx`Gg`NbnCkkFrfCk~Gn`Aq}H|gAumBtgFwbDha@c~CanCmzEmuRuxEwgBypCqc@uuCkm@efJ}`BwcEqnEceF_\\_fFvnAyqCtuNeqHlV}zCwjBmwFmG}~BlaAes@beGv_AxqAs\\rGc~ByiAo_EkiK_fBs[ifBzXi}Fwf@uqByxAoc@uyGdvAabEyQgpDuu@w[ybB_n@uvGehBkbBknAHynCzeEalBkz@wB}kAreCmzGg}AmsAscAeuH}{@{t@cgAdo@ylAxqGmfDpFlHytC~bBamCvgDqqGv_Maf@~}BytAblBu~CnnCq_Kbg@evOnuGueIsbD{bCav@_{C}}@okHyiCelDu_EucBonUyOamJktJyjFslAw|@moEtVe~BljAqtFm~DqxK_eFwhDe~GoaAshKo`EsyC}qSgcHa~FwtBssEywCc|AaqCjj@omT~uDo{Dwj@{sAcqDvG{fO_m@slKlnH}|K`CksGouBaaGyaF__IuuAcnGeeBctHwnAes]s_Ghb@chEcfFymBrFaoA~yAk]f`Jcm@z_BspB~B{gD{wD{nDeiAcoCd|@ehDjgE}mBttA_yAqSopFwnJ|EkeB{ZweC{yEaeHtfIevMxzAiwGd\\ywDqtCaeNiqAgpC{ZseHjhDgwBthFcd@lgAupD{Kq{GhsC{iErqL{oC`hDyqDhkG_cDraKgh@fvCqcIrnCidPbJezE}uAu{P~yBeuHppAuvInmEa|BtoBeeH|kGo}Bj~AweJlzAkuEmQimC}iAqmA}tDc}@epA{{AmpB}|Pjd@odDxcDkaHxu@w`OvnCuaG|}Cs{@`_AguA_A_fB{mA_kBg|AqlDpxAaiKiz@mqFk{GmfEqaCyyH{rDasEc_@msIifD{~HxUu`EnsC_jBb~Eri@f`E{{BpcIse@~rD{fDxxA}xCjYsxJ~uAu`HhfFm`DdwDa}I|vJuhDhrGvgAbzJcaDr~Alo@hcFca@daAxyAbh@lhDbxG}z@jaBnk@`u@voEloCmEfbFwiIllQikLjwFqpHneCjZfiAtqAp}Bpi@hjDefKrkCucB~yJcaBviDi{KhaDa~B`xAz|@ntMerEvkAydJvkEylEagBg{BjeH_cD|QakD|_Cpb@|Wnw@|s@aXbx@gjJnnCorDebDyg@zaCmmCqnAcvHljAgiBlek@ti_AdtGptKh|@fdIv_I|c[da@joBhkOfo\\thBfMdmBgkAvz@~bArfEdUlpDxhPx`EtrIdhGad@loFxkB`xDveM~_@|uQvo@fdC~_MrwJ|mD{VldAdwAdc@bvKpyCz~UfdC|qKhbBhqBp`An}IdArxLduGlsUdqBhpDjyAv~B_k@zzm@aDv{L_Tjko@a{@d_fBiAhx@e`Blog@}^b|y@jp@|xY_t@r~bAeg@rbe@s~@zsi@yn@xgi@yXdrQnQdwq@bGhcy@cBduGrK|tl@~\\fwbApQ`g^mmDhjBc_A|df@`}Qa|DduGqd@dcG~n@", 
      "zoomFactor": 2
    }
  ]
},
"US-LA": {
  "center": {
    "lat": 30.9815235, 
    "lng": -91.53179
  }, 
  "code": "US-LA", 
  "name": "Louisiana", 
  "polylines": [
    {
      "levels": "PJJKJLJMJLKJJKJKJP", 
      "numLevels": 18, 
      "points": "_acqDfamjP}{Fgu@rsAxvHiqK}eAtkCdwEvcK{jA}`FzaLi~K|]eX_nVacDos@lsKmqKdiBvaFo`EsjBoSnlDj_JgEeg@g|Et|FniBdHp`G", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKMJLJKJHJJJJJP", 
      "numLevels": 18, 
      "points": "ukkqD|nekP{gD`{[idPfvKd~Ce~F}tKamMrjOahFebDelDjyFl{@wE~gBepCtlAjuEy`@pk@khG|cCfdAszActDxlE{f@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PMKJMJKP", 
      "numLevels": 18, 
      "points": "ee~rDxgroPujTnt_@isImfU|bMk|XlGkiLxkGzjKjwFyi@lm@rwP", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PMKJLJJLJKKLKJLKJJJKNKKLJJJKKJKNLJLJJKKJMJKJJKKJJNJJJKLJJLKKILJLKKLLJJJNKJKKLMMJLJKPKJIIHHHHLIHHJGJIKHHHJHKHHIHHILHJHJIHJIIJHHIJHIKHHIEJHIIHJIHHJHHKGHNIIHHKGGJHIIHHKIHKIIIJGHHHKHKIIJGHHHIIKGIKHHGJGHKIIHHHKGIHIILIFHHJIIGIHFIMDGEGPCDEDBFHFDCLHKILJHJHPIKJLHHKHLKIHHLHJHHKIILHIKIMJHIKIJHKJHNJHHKHHKJHHIILHKIIKHKHJLHJKHIKIIHLIKIFJIKIJHLHKHILHHKHIHKIHMHJILIHHKJGILHJHJHLIIHIILHIHLIHJJHLHHOBEDGDDGCHOHIHIIIGIIIIJIHHJIHHHIIHHHMIHJIJHIGHHHHJHJHIHJHHJHIHHNKJJKMGOKHLKKKJJMJKMJKKMJKOKKKIKMJKKMJJIMILJLJJJNKLKJJKKJKLKNKKJJLLJP", 
      "numLevels": 18, 
      "points": "wgsoD`}r`Pmvg@ouX}fEv{IbxMb`CrXvpHw}G|ZwtL`mMmuFup@t`C~sEuuG|tWaeImv@rx@l~b@obIw`GkbHfhLmaJkY|]pc\\}_El_@`{@fxEmuJ|wSf|BhvCk_KtyAb{Hd_JzoHssE|oHy}Y~tBhwB|pIs}ChmCnaD|hGknCioAjjNt|S}qE{w@ixEdfHxwE`eNfh\\ixOfaFauLobCs~Bj_FdxD~_@kdLdlKv|FzoHinI~_AgdD`pG`nHdaDwEjhYtrGumDflFfmFybE~rDf|PsiA}wBz|GfcGek@jrAdvSqqEy~@ufCx_LzwGjmGcuG`kFmsFgvSw~EtYybAlkNcyMzsFcfBruZx}GvsCu|PdxT_jOdqHshKjg`@taCvlUiqTzBoJbqQimWulDrmGzio@wyF~nBghG}vEleCylC_eIfUwPngZ|~E|e@tuMz~^kjGak@``A|qLrn]siZ~wKdlm@aeHxp{@gcf@|hyBt{D`k~AxlE|qNulO~cRk|FwdT{k]kaE}sIeiHwzEbTcvBym@}RqfAspCtIEenAqj@sPcOffBkzC}Tm_@hr@ouFn`AevBym@qiJ}q@an@`~Du_FxvDarA^{qA}fAyxAnk@_hDmlA_vCkbCi{@_{Cg{Bvi@an@aa@csBphBsn@mn@mv@`m@}mBix@qlCpyDolC}kBcwBOsfAmwCfEogCgoB~bCun@uq@{fBzr@dAe|AinEkoBavA}gGarCo_@{iCt`@jBm~@cuApbA}cDaoEsyDqSmcD}aEmvA~]qPnbAq}AitAmgAhq@wxAxn@caBcXgTgoBgyBjR_LwyBiv@gZuzCbh@~Vb_@arAxeAod@tsC}_B{fA{a@x|@y`BoQc_@kQnWknByyCmxF}oBxrBqmBuu@ao@lhDmlAeEcc@lhBav@sSai@_fCq|@uj@ug@xy@afDxh@qVebBwrAhu@{I_~@co@lKe_@lfCltBvcDmq@diB{tBbw@k~DklAamAz~BamDlDac@v[xJvxAceBh{AjUx`AqaD`~CcaBk[_{GufG~G|bDcaDjQwo@vqCe|@lj@{hAnI}_Aax@wq@h|Aa~A}TjKhpDsaDzwCs^aDi]qcEg|CmqAeGr`D_bBhbBvj@naByQbhBi}C||DyoBhc@wpAzdBe{ClQeQ}bBwyDi]gc@}r@}`Cz`@ceFiyBzVbfB}\\re@ooBa^inCjcCmdCyw@cjDrkAk~Ap}DglEtmAcdCbWlGheAmwCbi@tJfvC}iBsa@n@hnButA`uEunCdl@seE|hD}dAha@u`@j|Cw_g@{@cad@zAytz@~]_sc@vG{oZyPhCgvk@~Gqey@o@ilElLwco@zEwop@~G}br@vh@gu~B_W_}uBxAwfDIuw`@tA_aQtnAu@vqKrfHnfC{bAdx@yqDwnAijE_zBgl@_kFbNyjAi_Cu@uvB|rEwiBj}MrWt_FlfKxiNtwAfgAi{BxIcqFt`DypFdxJfvNnqBzh@vfHk{Ekv@{eHyp@cdBshDa}BkFkyBlgBmhAt`AxN|kEjqEff@|dDl{A|xAlxBq~@v}DchLheB{QzZtkDme@nlB{aIjaInxChzDj~CuEhaIypJr[odE_aAsuFxoAihClbCb[`hCdtFv_Eu_An|@kxAr`AirLs|E_yDvIg|@poMl_Gjp@joAif@`hGxd@|w@v`AbRzoBaoAj|Gxe@waDtqKlgBbaCdA~}CjlBdnA_bAb_BjzBbaGtrE|z@`iDk_Ad|@_jH{sAs_DrwAatDwvCqu@q`Dfx@jzA{zD~Bs_C`{Epm@zcDfyDntApkEn|E_v@tIxvCgcE~aF`Ov{BfyB_OjkC{}IzgA}tAjcAsCtuDp}E`U~vInmM~nFp~EjkGxpAh}Bv{DwpCpfBly@ou@|aDesE`bBkItbA|yB`cEvhHllA`{Cj{Bhl@_`Em_AyjMpwAbGr|@lsBau@`eJt^d~DxI{`@bzE|mC|bKvFxtD`wB_HdqHotCj{Fxj@v}@`hCtE|lBghA~Ic~NndBqdAprCzwBf{Bn~Fzp@noFnx@bUvdMxGnkEiwExdBam@hcDf|AzNtuAghB|oDejBtdA{{C|BvFnmB`hAh~AjnEgs@da@}yCvuAl|@zgCcI~qCofFvxCoSraBhzAvmA~wFcl@bbNbh@dz@rzDyh@xhDe`Fp|Egz@j|H|qDv{GuwIxtCqoAn~Cl`Cf`CrvIfaAh[rDynwAHwzVaFskk@_@ass@{B_mBcRuze@mKymOd@kdrAs@guR~c@yw@thBtR~w@mj@`~@`zBf`Bjw@jsCmq@r^|lBjcA}kAvl@pElMdfB~nF|NbBxvB~`E}~@|G`dCxeB|A~DzxAhhC|tAvbGyeAna@fkA|z@oL`VjkAzhBvs@`u@irAdSjaAlbCtAvU}f@b{@x}@{[mbBtyBs~@dJiuAj|Ch{ArvLcwDxOyoBt}EcmBbnB{mCfJ{qAhzAwc@zRklBz}@uEda@udAnkBaq@~yGOhbCk`CrsC{p@CwqAfiAyqAzyBaIniArrBbcB`Lda@uqAvoEwY`x@__B`g@`VnaHu`F`vAre]_xHt~DiqF~~b@ojRbxX{iAda_@|`N~oLj`VzpUdiQatDtzDkjVv~Bwb_@kjAesVc_SwkR~{HadQwmIqjJlkFw}AggGi{I|~FyzB~bLpdLluGvxXdrJunDepBmtSd`MsPpgC}pOokCubGqsTwfAo|Ey`ZtmJbnBhvE_yMxcAzkIplQisDpnBpuBvbEadJnuAtlIakH`tKj{MbkJakA`oTf}IugJ|pAnuB`nEioRxpDukEctDdeVkkFdkNpv@nsBdeLovJyyBrdQ|u@j}B~bEi}CkYpnH~`Zujk@zuLgn@`Umx\\pcJugHe|@wbMliIyLi_IgoLnjJqkKzlNw{@cgAo~OxuJhuK~dB_}MpaKv_FuwH|lLveIs}Ah`DjiGh|Fe{@clSx{Qt`K`eBzkVtyY", 
      "zoomFactor": 2
    }
  ]
},
"US-MA": {
  "center": {
    "lat": 42.062569, 
    "lng": -71.708305
  }, 
  "code": "US-MA", 
  "name": "Massachusetts", 
  "polylines": [
    {
      "levels": "PJLJBKILJLJLP", 
      "numLevels": 18, 
      "points": "ejuzFl_{jLqfEnoTgtCqe@|eBsiTkuEo|KgoAo|CwlAr|Bf{Fj|JoiIekI_gGh{Av}QogOblGlNrsArhY", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PLJKJILJKJJJMJP", 
      "numLevels": 18, 
      "points": "m`a{Fte}nLezHxnMqWu~JdkDmgAmdJyvByeMwmOgzBi`KdxGmHcyE_dFzeH{{Alk@znCpgAizJzcJitDhm@fip@|_F~`E", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKIFIFKHHHKJFNFIIFBHHHHHJJJJCFOJHPDDGEEHLGJKKIJJJHHPLMJKJKNJJGLJKKKMKIKMKKLMKJOKJJMJLJJJP", 
      "numLevels": 18, 
      "points": "obg|FbaaqL{t^luCcpC~fJouDn{DyeGjjFkkCjhIkkA|~BsrDnb@qvGicAwnBrp@q}Bwy@ln@||HuvPuHivEoVzZjeVd^pty@utAb[{o@|cx@yBraGgZdogA~BxlKft@vaAmF`aDko@rIuStq[~dE`hAb^bxH_bFuFuNh`d@y@dvFodAbttAwzDfzAqmrA_|[ccn@wbQjb@{pm@|Qi{Q~fAegzAt`@aja@xqAshcAjJ}uDji@_{vBujDkxEelBoiAz\\kqIokLa`@mcA{xJfvA}vI{cH}yFisEqiSyIcpCpqCimHwUc_Fbwf@snMrjBsr[zlKpzFhaF~ab@zeR~uN|`BzaLft[rjMj~HqtTebEy}Dx_@ahLdiAywHtsQqhPbcc@{cLtgFwhNlmWmOlcKwhUdhCmf\\r|@pcLyCepY{mLwic@wrMktBon[jpR_iJne]klAgmVv_H{oOvzVmzOvsY}`H~wQ`dFfoJ|puArjGr{EdzDj{f@_eBnlD}`b@_yGzgTx{i@al@jhIbfUrhTdhDtsU", 
      "zoomFactor": 2
    }
  ]
},
"US-MD": {
  "center": {
    "lat": 38.847845, 
    "lng": -77.267745
  }, 
  "code": "US-MD", 
  "name": "Maryland", 
  "polylines": [
    {
      "levels": "PIIHNJIP", 
      "numLevels": 18, 
      "points": "chbgFvfljMm_AccDu~I}wEurTixG}oUuvL~ge@jkN|tQzpLxDxnD", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PJLP", 
      "numLevels": 18, 
      "points": "_~{hFxnhiMyxWgxB|AmjCzuWtcG", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PJMJLJJJKJJJJP", 
      "numLevels": 18, 
      "points": "wuclFd`dqMqiSetB_bOccJr`K_bIvxIyGk_DjfDlbGpyBauJtGdcAnuGb{A{xClyDbr@wiAl{B`lHeoAbgCn}G", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PMLLJJLKIMKJKLNJKLMJJJJJLJJMKLIJMJJJKLLIMIKMLKIOJLJLLHNJIIKKLJLIKMGKJJMLPKKLLJLJNKIJEIHKJNAKKJJJJGJHHMIIHLHHJHHHLHHIKEIHJHIIIKHJIJGHJIKGGJOHIHIIHHJIKCJLHIHHKJHHIJKIJKHHIGLHHGIHHKJHJGIMIHJJIHHKJHHLHIIIJIFIIHHHNPFAEEAGHDDBEF@APHEEEGFFNDNJKJJLJP", 
      "numLevels": 18, 
      "points": "}`wfFd~ulMsz@lni@}}UaxQodNp`XeaJgtJus@lrCirC{dLp\\ztRweRwkC}pB~xAzfQjiK}AlzGcuFn~CnhKbvGowa@duk@gdGiMyrKunRkbIxnJxoCoxi@axHgWl{D|tBiuBrtDk~QhkH_FpwHsnI~rHik@vpGttPrwL{yBvoAqjYegNrlLyaN}pCgvDi|Qy`IqXsoF}s@zgDexHem@jjDvqB_hIjwOwj[mgPn_DnqT}kF`jBumM{~BwvU{uSufFmsM{`Cctc@i_BreX{}MobDiiIhiC}}G`aJhkDjeHtlZbzM`hDxaM_rBryYjt^vyEufAtyXsgBreMlmDcrFhoE~hA`jBx|DjjCgkA{iFcbE|eN}iZd`h@tkH|c\\v`NjsHgtC`sc@eeBrpXk`WxyGxyBn~C`cBu}AjzHopM|kHyzF|yWljm@ygz@`u_@atA{pa@ngo@wgApvb@ut]thSzzPltG{aEzqK{uQnvDdaFzti@inClyEkjMxgCmm^sz[mxDm]ubDyfEoeAmeAhSwyCgi@maAkpLqEs{R}eYq}Mj}Q_gDntEp~JptNmkEzvDmdA`|PabInkAyyEzkL_d@`hCxIt{O{vAteDooCbyBknAfrE{}FhUyxBmlFscG}fBc`AlQkaC~tD}uBvkHawDhfDgGhhHouBbiKbE~kHkw@llCshAhYcgCgv@apBhbAwmBuuBil@pUwfCxcByk@`zGao@bNacAqv@mkAns@fXivByfC|xAakBsmDhYfnIuq@xlCs}@klCsjBzUxUzg@of@js@|jB|`CkbEx]akAd~Bwf@u\\iEihEol@wpA}jExN~R~pA_yAtlEbbBlMr[bmAaiC~{E~R|v@foCsjA`d@pz@g}CfwBdlAr`EitC`bEqhIngLavB~hP|sBfdCbKrpCl_BdIvkBbqDfmCp~AsiCfsMhr@fv@rEpaCbhBpj@kg@hfHloEimD{^lbHdiA|dAlcEg_GxEp{CbzAb}@fuAf~Cs_@xjDnXhyIizA`zFzb@nkEiq@jjAtEbkBolCvvHwiBneBc_@prD}zBxkA{k@iiFunA{b@{`@vJdAd{EemBx^xrA`~Cj_B|@txDttC`uBcbBzTfdEpiFjkEjwKroO~gC~|AazG`iNqKh`Br|Axe@EjsE`f@gp@fkB|l@h|DviDbR`fDx~Bp]jwGb~QfqCzyBjyCp_Bxs@h}HnmCnpFndJvqKiFliAdbBfrD_ceBqv@`EinO}QebzA{Cq}T}BcqsAeA}xHqGirm@nc@_cxByA}eAwBcpn@i@qxj@iAmhg@dEcbj@}How`AiAyiQgI{~bAtpaActBt_Peq@rkHyQvvSqu@by{@{mDzgb@wuAl~PyUbmQsr@`p@_dcAv\\afq@dxNlcK`vQqYdcMfzTb{X`rTfeI_Cx}Bhpp@jcDdgC", 
      "zoomFactor": 2
    }
  ]
},
"US-ME": {
  "center": {
    "lat": 45.2721805, 
    "lng": -69.028395
  }, 
  "code": "US-ME", 
  "name": "Maine", 
  "polylines": [
    {
      "levels": "PKLIJMLKP", 
      "numLevels": 18, 
      "points": "su|lGn{~_Ly|Gp`OixSq|AsfCijF{yDj_@mu@sxUdcScmM|tGriZ|tK`cB", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PLIKJHHMIHHIJHJBEIPKLHJILMLJKKMJKJJKLJLEMOLKMJKJPNJKJJJNJJJMKKKKMKKLFLLPILJKJKKJKJLIMJKJJLKJNJMJKJJNJJKLJJMLJJLKMKJMIKJMJJJNKMIKJLKKJJKMKKKJJKP", 
      "numLevels": 18, 
      "points": "}e_fGn{hnLu_Ed{\\ahFdiAizMikBg}GfdPsbCl\\}pKjnKgyDvy@ceGcmBogEfy@s_H}fAo`Bb^aiBqzA}}Adj@_o@lkB{yi@`aAs{~A|uC}mjAx|B{rzBjnJuhFy_XzcUkeOihIwpEm}My{Dg`F|eBgvEahEnnEws^esVbrOez[wv_@s~Jgm]uiL|zBkfTau^_|Gqg@_vCpgKknOe|DksAdzCkyL_wMaiIpqIuf[w`QoyPye[_f[{iEyqVguDiysCykrCtbEwxb@bd_@c_AltMouZ}kUigiAdiAibWubMw_Jr_@_iSrzw@y{tAbqxE_bAp}DeyCdmFlrFt{Ha{E~nEbpGpvUjArtBqzHshCgyErzMabS~mA_ja@hkPapCzmBbePfnTuuOhtQfrJ|uPuoFvcLoiQiyJ_~LvdDccTduEg~Azw^gtO~tIn{NnyM}sa@dkHhoFxwW|rd@r@tbTwkFfsNrdQnsb@bjJ`jHauAlqd@`oB|fH~iOdbGutBziLctEs]d_CfoCboRryDjUniJsiQtaKi_BnjThqJjaV}rE`tKb}KrcWpiTeiCbzDlvDe{Onib@`uBldM_|OvDafQucMmxGrWu`JdhN{wIp@|jI~dFfaGmhIdtMrVrpKzx[`b^p`DzgDzbF|da@`jIf{Vfg[t[vpMclM~hIex@fkHf}YriPjgG`vS_m@ntMc_Xox@olImgGttQb`TxuGhmDpgTctCjmCr_D{wDriDm_m@rjCmaCynEadDv`AlnMpcOlsn@ojLrnDzqFceBvdCscRgb@wuE`}FhxObeBxgC~rLokBfeDasJyjAX|rFt{I|lXbiSxmNneTwsApgG`iVvlS`wCfxN|wPztAj_Ofxn@`wW", 
      "zoomFactor": 2
    }
  ]
},
"US-MI": {
  "center": {
    "lat": 45.0616666667, 
    "lng": -84.938333333
  }, 
  "code": "US-MI", 
  "name": "Michigan", 
  "polylines": [
    {
      "levels": "PKEDFFCEBDPKIJNKLIMJLJIJJLILJOKJILKNKKLNIKIMJIJMKMIJKPKJKIKJIJJLIJJHOJJLJKLDMKHKJJLOJMJKHJLKOJLGJPJJLJJKMJJJKLJKNFDFCP", 
      "numLevels": 18, 
      "points": "g`o}FzrodOukK{JuDpiFcEpufAoCliS|D`weAuDphZwEtps@q@dn_@eCjww@Bdn{@avZuli@wwi@geVq_WmiWuw`@cmPczcAobL{rbAz|IgddAn~c@cvc@bgNgkTigQrd@unGq{A~xDupF_`@ykX~~Dr[udCcbTxuN}hXayXcy_@mjUal`@_sEiza@t_CwqEmi\\wnGw~CgeM`}AyhHw}DgcPcat@}bh@qfc@vbBkvGxkj@vaPncb@o|Al~AuzTq_RarM{h\\q~Kggf@p`@ebKeiBucHsfLqvHwoh@oQq{SmdFkpKeuIzg^cpSlpFoxJehGsmIinQspIafA_iGclo@tvWeqq@yiAwa[zwEksUfsJsvLvdMgvDpj@{vb@paOojZkQowL`hKwlVseAizQbfE_f@d}IktQfaBbfDboGyhC|mUoxOn}GhvXhcGk`AxqAf`Eh~Le}EjyKclTbw]grFftc@ftF`fb@veFtlMbs`@txPhsFrmRn{DhiM`xSnuE`~_@n}GtvG~ui@lzBngRmtm@qo@muGycVcdWjoCedFakG_mD_hRgkRawQc`GkhXujjAnbFqeYr|J_gN~`c@{jT`fQunAp_eB_|Rr_f@{kOblMvdIroY~FhdXzwGpMd}WkjFciA_iAruQ~zGfuPzmCyoBh{UdwOpjFwqA|pQnsIpvLvxa@~pa@fzO~}NyVji{@~cx@nq@z|u@pEfmSvp@`y~AnDj|Cj{@lhnA", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PJKJMJJJKJKMIJLJP", 
      "numLevels": 18, 
      "points": "iggwGzdc}Ns`FxvHfhBxea@gzJrjHdeDtmEylG}aE`_D}mIgrFgvGiv@wdOq}E`i@_lAxdIc{B}bOp_BoxJp~MyyIpvCc{JlaKrkGhr@xlK", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PIILHHHHHLJJIIIHHMJJIKHKJGJJHHLHHHJIJHILHKINEHIHIIGIIHHHJHHIIJIHHIHHJFFKDLHHHKHHIHJJPKGLLIKKJJOKKJKIJMLKHMLLJKNKLKLJJKJNKJJMJJKKJMKKLKJKJPKCJKJMMJKIMKHJLJLIJIJIJMIKLNKLJIJP", 
      "numLevels": 18, 
      "points": "agirGf|ruOahEztNq_FjbJmkCvg@wmAazA{{CgKm_AwyA_|CgCyyMmpJotAmI{vD|}GxnFdwLy`@|gL`kAzqAauCbaC_Kfg@l}@|`@qVf{@szF_tEsrF`bAqdCobHwjEovCc{GpaBmuCpqCLigGefEgeAaoAbEy`GhqGicA_Qy`Au`Fcr@wTujB`sC}}@lA}cA`~FwoDlbEkaBftQwqDpaCzv@v_K}`@zfFemDp`Gu_B_r@iqFi_JmpBt|DesD}Jmb@plBo}@`sFsjB|xDbb@nxEwvBrfG|^leGw\\piCimDxnHzdAxpEmkBp|H`IjwDguAb_Aib@peCiCtkEt_AvgDah@riCvdCfoBpC`oDgfDtqErF|bDqaAnmCts@hbHufAzZmVbeBtz@baAmcH~qVmfDrvJyyGtjU{|]fe`DobFzlc@qyCzTsrDneD_nHjyBmnKjxHsN|cHstAbfAaO~|DiwBxLkl@veAliAz_M}sDtlCunTk`kAksPy{Xq{IwpQk~Ci_nAkhMyr`@shMwmPcBomXkrEkvKekMiwGytV}zp@xnQefAvxC_{S`mM`JpdG}_MfeK~\\bhM`~Dl{I}yDor[_os@xwG`fAecAex\\bLcqYtfMqgm@jf_Amax@vg@k}q@qxEwjSn}P{jYcgGgzTfqK_uVqbZ{ia@{zTik|@bnBa`IcvF_vm@~_CqadAicOant@qwAuwt@z}MfbMdk[}p@pnGdkE`uDyyEgfAgtOtpG{|WarFo}`@zsMgdJqeMkr]cq@ckSvzm@ikXvaGxzPd_FebDc\\qzWveHorPlvEniE`kL_dMn|BcbPl|Gb[kqBpkg@a`Crbn@faCrv[guJboUlM`bMneb@~iGoyE~hVgeYxbh@quMxy|@uJtsXneXln[hT||f@xfAlwIrwFjLs~Gnm\\`kBjkd@x`G~~In|L~nDx~LnjUbuAl{LnzCcm@|uAfqIzjPhnIasDlxIkhGdiAsuVc|TckAroa@nvT|jZzrBjkj@`sZzvYxpX~}Lp_r@tcp@|qIbu@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKMKINKKOIJLP", 
      "numLevels": 18, 
      "points": "mjx}GfcszOebWlhJqpClcWegTrGcbHopQyyKkgKq}Pufk@mnCmtqAtuIijOhnC~mEzyEbab@xu]trz@dph@~ed@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PJKLOKJJP", 
      "numLevels": 18, 
      "points": "ks{bHhca_Pi_CljIitFlv@ayIq|Gayl@as_C|mZv}WvfMh}t@|kTfyWbeDlvT", 
      "zoomFactor": 2
    }
  ]
},
"US-MN": {
  "center": {
    "lat": 46.434903, 
    "lng": -93.380055
  }, 
  "code": "US-MN", 
  "name": "Minnesota", 
  "polylines": [
    {
      "levels": "PDEDBFDDEBGFEEDAEPFFGFEEGNHJHKHHHMJIHLFIIMHHHIKHIHKIIJHFLHHIJIIKIIHIIIHKHHIIIHIHHHIJHIHIIHHHLIIIIHIIIJIIJIHIHLIIEJGJJJIIJIHIHIIJIIJHIJJHIIJJJIIHHIKHHIIHHILIHIHIHIIIJHIIP?MMNJNKBJKLJNKJJKHMJLJJKLJJLKJLIMKHKKKMKIMLJJKJJKJPJJJLKKIJKNIDCMIJHJJJIHKHIJGPILHHKIHMJHIKGIIJKIHJHIEINHIKIKHHKHILGIIHKHGJGIKIGNGIHIMEP", 
      "numLevels": 18, 
      "points": "g_ohGva{nPrAzxbA}@tjhA_DfnSkEnszAa@xhD`EhevAw@lz\\zApp}@nGfht@fDxug@_Kt_nA`C|yJ_Ep~{A|CliLvBhpmApAh|d@kFj_mAmdcAcWolcA~CogaAiMmtP`Iiu`@kHqi`@jD}ez@{H}rCjRixD|{BmbHnvIudChdMewArePehHjwGsqJ`bEi_LplMk{ChiAybGuiCwfPgga@cpL}hI}z@cgBquUmbCysA__@akMbyA_oMyvCi}NhwBc{AlgByqC}GopCfhAgaRhWoyA|nA}t@vgF{hIx`Fo|A`eCsbGp_@o`C|}C{jRdcA_fAxzByuC~qAmb@`d@kqHnTqoDyjAmxIkFwuHbhBelE_tDokCj|@myIecCisAle@nXlzCccB`Jwn@dkAguA{s@[zpCiqEno@mi@jbAesCknAswGfZauA{o@qqJb|BqpBgnA}vLbaAmeBnmAofFmiAm`Clw@ykDyr@}sB`kAwoCobAczCr~@_YvjB{rCkfA{yCzbAgsFe}As`Ctw@apC{fAarBfz@smFig@cwA~bCumJpcBazF|tEysHds@i`Eh`Dc~A~aDyqBuh@qfGloCs`@j}BogGs_@mfFpkEweQvuBsiCh_Dm~Dlf@e_BvmC_dD}Deb@l`BubAw~Bmt@pdCqm@eF_{BdEgu@ig@cWq{BmwAjsDif@w}Dga@nqBi_DsVc`@noAwrA{zCur@~Daj@nnBqJ_hBqu@lE_m@xnB}v@g|B{d@hxC}|Eod@wIlwBwx@{fBwiA|GwVprC{yBqxDgLj`Ca{@hJzTotDebCoQiExtCanNkw@_C|tAigB_w@mV|cByh@t]yZkuAqnAhdCcaA{aBmbAzd@oSskBmhDnWei@agCkw@`[]{zBsuGi`Ao`CfyBkrAoh@imBlyCcbCmMws@f_Bip@au@emBtr@c~BbdDkv@ux@g_@daBy~Bsx@akFh[}iJ~|FaiLtpA@ws_DAi~rFirgAyc@v~F{m}@frwAom\\dmRnqArnKyfW`Q_hZdRi_Zh{Im_KhiDiqjAvkRcbEluAidEwlCqcs@i~A_pH}lGgn@{tGs~\\baA}ph@aJif[zeP_qi@Y{_PniFq_Btq@xcMtuEzo@z}B}yg@zkFk`GdvG`iBluY_dSerCoeQipI|pCqpIyuCgyAsi\\feAkvP|oSwzIrsG_gd@py@o_Nb_Oir@z_AojYn{JlPwjFuz_AwgU{mh@}nJqw^~j_@ctV{nEmja@|sDiaAc|BkkoAxeD_dVxeK_wF`aEm|OksEgo\\dzCoui@xw@rpQhnE`bAtiYr}eAlkUfrbBnro@|}bBvs`A|ivAnse@|{_A~kY~cw@`dWjsWdIfhPto@gbBpln@xG`tq@t@bhOtAdeBllFfuEztBtf@btByx@dvJxsGlhFqGb`KrbEjrDj}ErdUryCdyFh~GbmD`o@rzAfmMr|DviExsI`~B|cD`yKr}Cf|Kqt@l_BedGkDkfMjiBssElaNcjGv{Ag~DnaBq|@|qGtVliEv`FnwGrkCt_C`tFvsOdv@~_Dvk@t{DimBjnG`BdgHz_IxnG_rEzbCxXnwKqkB``C`Yz_BboB|gFon@|fDgSnlPluGrjEujLhzLmzShiEwdCnzEknRpjCe{_@dlAm~BzlHusCx_FmhHjnBokGpmColUh~HofVt}CmpE|eCwcBhuDmAx_EoqEl}KqxFfpIatQpvLcvR~aDkzHrc@{jErCs}FvnHw_SdoFmgI|oRw{NnpJg~FnyKxo@vxGiBdiNu}CpxHfn@ljHeiBb@`ujApEjhV", 
      "zoomFactor": 2
    }
  ]
},
"US-MO": {
  "center": {
    "lat": 38.299705, 
    "lng": -92.436257
  }, 
  "code": "US-MO", 
  "name": "Missouri", 
  "polylines": [
    {
      "levels": "PJHJIIKHIKHJGIMHJIGLHHIHLIGHJGKIHMIHJJILHIKIILHIHLHIHILJHIOEBNJHHIHIFIIIMIHJGJHIINEDDGFECCGCBEEDAEFPEGDDFCEGDEIEEAHOGHIIDKJIJHKIEIIHMJJJIIKHGHLHIIJHIKHHJMGIHIKIIIIGIGHMHKHHIHKHJLHHJHIJHIKHIJKIPEBFECJDFEFAGCGFGPFJJJHHJJHHIHHHMIFBLGJDJHHJJDMEHIJHJEILHGJIIHJINJIJLIHJHMIHIKHHJIHEIGKHNIIHJHHGIKJKIHHKJGIJHMHHIKIHLJGJHMHJIJHJLGKIJJIGKIIJJIP", 
      "numLevels": 18, 
      "points": "{pp`Fniz~OlaPzxCxnCteFvvAnj@~zCww@`jA{oFjwCkAdw@|`DwJl`DjpEjvBxvAlFfdGkxD~rBzx@tfC|nCvsHd}@|mAddEkd@fdGicHxqFwi@j|BvRrcClz@r_AbsSpsGrp@mT~_HhrEd`AnjC}xBfcCwmEadBme@rc@kaCo_A{iCj_A{eArfA_a@xgFri@``D~dB`jAvlCiFz_CerEjcDijBx_EfuDlxFk|C~xGcCx~@r|Ckw@b}Jx{BxiB`fDecBxhDgrK~dB}i@ll@ff@leBt|MqvAbgIhPxtCxeA|Ep{B}tB`gF}jJdeE{tD|iCGn}DhfNfeBjbAfdJtaA|`DxlE`R|cn@nb@vp}@xH|sQ}|RimKqvCq}DyPqbCqqBksDkuCkOifAgpAmwC}hJo}Aa{Da~GedCexA{pGgoDeeBmzCxnB}gF_lBs{BtJu{AvnDan@`dFimBvj@ybEih@_Uj|B}uEnoA{DxnMdJzwdA|Iznj@xFpj_AiRlgu@dCn`GsBh_m@sAhwtAm@tsBtCrqhAxD`vp@RnqM}Cr|uApAz`E~@pjs@\\v~q@uFbtj@`IfvgBakb@xVsdQxB_rl@aGkiKv@{uy@{Jaqw@l@kwDx@umcA}Nw}CtBqt`AxIooNcA{{r@ya@ioRgCepg@{R{hLeFupDej@a`AlfAmi@|qEafB|tD|UxvIe_D~rJkwAh_Ee|H`nAwvCvhHcfFbeDyiBzUg|FspA}BpjDs{DtkEcnDdlDuqCnrI}jCfk@}gHfsIamDlj@_bDcyIirF`NiaFilDgoCwuHaeH{gB{Z_u@dz@ijCt@i|CmmA}lDq{Auh@_h@tc@vPrvG}lBfrA{l@qJycAcsEurCqbAicAh|@}\\t~CqdB|mA}bHzIs\\jfD~VtaJrvBfhAteA|xDySdiFumFlvHiLjnG{mDdtAsWpoEceJhfLw~CfbFuVtbDw|AnwBgZfpCshEm}@u|AewBi|Brr@aeBjxDagGnoFktFpb@_tAr~@_uFnvLeoGnmHbCp_IwqA_Guw@qkDg}A{I{kAjoB}iFnO}jP|lJ_gD}_AgpBggDmpDp]mk@tnAd\\dhAnfF`\\or@bxGkkBxcD{tFlXl\\ydjAfN_g_@f\\a~x@dHuyu@rHoe]fSweo@aRc`j@sZmgl@{Mesj@~@_sd@aWirs@g`@oyiAgJc}Lsq@ysv@iBa{_@ar@qeo@mHc~f@beBsyClkAwgDpwDfLhtBwqLdnDkb@f~Bw_Et`Coh@~r@s_HlwAfb@xe@wx@vzC}Jh^wiDtxA{}@i@arAdvBwoDddKbmFbkJnkAd}Hpn@|zKzz@~fLujA~{JqgB~sJiyFnvCihB~{BzUtfB|hBviCkJlqJsdLrhG{r@~cFsf@~pF{sHzwOcjUlgHceHzrCafKjvIwuDxwDgnDzpGygPjxHw_RfnIw{LfqH{`GdoC}b@lsDkwAxaIaHvzHucD~|EljBj~BoH|_SmgFhsIkcGfz@sbJy}BgxFieLwyJwRyaJ|hFifQd@a~Fx~@{yEd_KouT`lC_zBdzDvt@||AbsAllAjoD`rHhnEprCnb@|bGusBbnHXrgHvdJvzDx}B|vAl[xyPj`FfcF`kFl~CfvBbdGpaAxlPo[~{GknDvgCeeH`vGo}E|nEwaHlyEcfMnfCc_BdsFybNftCoaEpb@sgIlbIh`CnrEq_GjLehFybB}qEatAac@rAiy@loKmaWfaFuhFdaC}}AroFwy@~tFmrOteAouJn|A}q@bwDhc@hvEic@xqGlgAntNs{DxoFg`GpfGyaDrxI~q@|dBhmEh}@|eE~wCfrAlqDCn~BwvCdMyvCdwDbQnoJalDrnDqgBfmFypGtvHnQ`vF{`Mn`AgoDgz@{`C_vB`MmnEd{G}wCag@qc@evBvXc}BrzGycDvnAskDxfGofBkGylKraA}lCjrCsL", 
      "zoomFactor": 2
    }
  ]
},
"US-MS": {
  "center": {
    "lat": 32.59998, 
    "lng": -89.867077
  }, 
  "code": "US-MS", 
  "name": "Mississippi", 
  "polylines": [
    {
      "levels": "PEADCKOKJKKJKJLJKJKNHHIHJHHJHIHJHJHHHHGIHJIJHIMHHHIIHHHIJHHIJJIIHIIIIHJHHNCGDDGDEBPHHLHJJHILHIHLIIHIILHJHJHLIGJKHHILIJHMHIKHIHKHHLIHKHLHJIKIJFIKILHIIKIHKJHLJHKHKIIKHLIIHHJKHHKHHJNHJKHJIKIHJMIKIHLIIKHHGLHJIGKLHKHHLJJLIKIHJILIIFCJIKGILIIKHJILHJKHLHIHILGIIKIKGHJGLJHHJLHHKHGHIKHJKIIHNJHJLHJIHLHKHIHIHLHHJIKHMIHIHILHHJIJLIILJJHLIJHLKIHKHKHHKJHJGLJHJHHJGHKHKFLIHKILJHJLHJHIJHKIJIIILJHHJFIHLBIHIKHIPEFEEGDFEELIHPGEFEGHEFGCFFKJEP", 
      "numLevels": 18, 
      "points": "owz~DnpzzObn|@odBdnVo`@lrr@wiAb~aAyaBd}FwLpfDfuKutIrdUboFjrSsdPted@dsAx_JtrBcuGphO|fkAsfJeOiq@l_Kr}ApkCdaHurFzdKv}Q~yIrkCrd@poYoaHt`Fag@aVax@~~AwoEvYea@tqAccBaLoiAsrB{yB`IgiAxqABvqAssCzp@ibCj`C_zGNokB`q@ea@tdA{}@tE{RjlBizAvc@gJzqAcnBzmCu}EbmByOxoBsvLbwDk|Ci{AeJhuAuyBr~@z[lbBc{@y}@wU|f@mbCuAeSkaAau@hrA{hBws@aVkkA}z@nLoa@gkAwbGxeAihC}tA_E{xAyeB}A}GadC_aE|~@cByvB_oF}NmMefBwl@qEkcA|kAs^}lBksClq@g`Bkw@a~@azB_x@lj@uhBuR_d@xw@r@fuRe@jdrAlKxmObRtze@zB~lB^`ss@`Frkk@IvzVsDxnwAgaAi[g`CsvIo~Cm`CytCpoAw{GtwIk|H}qDq|Efz@yhDd`FszDxh@ch@ez@bl@cbNwmA_xFsaBizAwxCnS_rCnfF{gCbIwuAm|@ea@|yCknEfs@ahAi~AwFomBz{C}BdjBudAfhB}oD{NuuAicDg|AydB`m@okEhwEwdMyGox@cU{p@ooFg{Bo~FqrC{wBodBpdA_Jb~N}lBfhAahCuEyj@w}@ntCk{F~GeqHytDawB}bKwFczE}mCyIz`@u^e~D`u@aeJs|@msBqwAcGl_AxjMil@~_Ea{Ck{BwhHmlA}yBacEjIubAdsEabBnu@}aDqfBmy@w{DvpCypAi}Bq~EkkGomM_oFaU_wIuuDq}EkcArC{gA|tAkkCz}IgyB~NaOw{BfcE_bFuIyvCo|E~u@otAqkE{cDgyDa{Eqm@_Cr_CkzAzzDp`Dgx@vvCpu@swA`tDzsAr_De|@~iHaiDj_AurE}z@kzBcaG~aAc_BklBenAeA_~CmgBcaCvaDuqKk|Gye@{oB`oAw`AcRyd@}w@hf@ahGkp@koAqoMm_GwIf|@r|E~xDs`AhrLo|@jxAw_Et_AahCetFmbCc[yoAhhC~`AruFs[ndEiaIxpJk~CtEoxCizDzaIkaIle@olB{ZukDieBzQw}DbhLmxBp~@m{A}xAgf@}dD}kEkqEu`AyNmgBlhAjFjyBrhD`}Bxp@bdBjv@zeHwfHj{EoqB{h@exJgvNu`DxpFyIbqFggAh{ByiNuwAu_FmfKk}MsW}rEviBt@tvBxjAh_C~jFcN~yBfl@vnAhjEex@xqDofCzbAwqKsfHunAt@eu@eH_tB}Wui@kkEkqBue@y{CftDalCjpGeiDb^m|@wnB`wB{~IsvAg~CefBqz@qoKpb@o|BgiF{`FcwAygAvrApFnkCtlGdeDswBpyBuoIdwBmfFueAmsEyqC{gBqoDafCkjBkoDiBue@|nAzSdjAtjHhrAvaDtoFoQ|fHmkCxvByo@g`@ibC_jLu{@qbAghBuC_rCn|@esBbaFhm@nx@xjFiNjwBx}@rWd~HacBqb@cvA}xBkpFgiDyeAdNy}A|cCyCry@uiBlwAitEsDxaBirFaOszBerFqkBoaClVulEb}H{`Cn|@}pBuToy@kmH~}FcgGf|A{gF{_Cc~GejCbEsuAtkBldAfmHiYhwCkbArw@unHp]sr@{c@vUidEa~@}rF`iBunC|a@a{Cmn@coCcuAyeAwsApf@qmBnoFkgDhaDerC~g@soLikGsnFzdJ}zBdqAsgAwvBl~BopFe]oeCliC_y@fn@_sAqh@uhCgfA{UiaBjwAoeB}Jw}BanC}y@yoKowJa|BgJzxF}oCp_FuyDjdAoyDuwCbmFkaO}E}mBmlBmdCkwCh_BgxA~fRoyDlkAa`B_`@~`EkuKy_AigEyiH_n@ohC{kB{B{uAdbCeuEeqFq`Au_H`wAqr@{g@ub@}fLnyAsf@hmGlr@nLw}@cjAqeCm_FoBypFcmImpDeyC}aCm\\_iGv`BgsCs{@wkAuzAsbAgqDalA{g@yqHvdHeoCx_AgnBgu@wtI_qBtxAqhCjtE`t@d|Aut@iFk{DisEeiGihElVpLloG{dAdzBw`NlyAciB__CvIeeApaBg{AfuC{NxkB~pBvrBomAzQqrBwxAqvEeyB_OgrFlnBu~Co{AejEpmC}oCeY{_@uiErsAa_A~gFrb@jRgeA{u@{qBcyBueKl_AgsBkH_dCmqAaLymB{RmuAwwDivCetCqpB}D{bAdf@orDz_I{iCnc@pHa{qBeH_yLxDclz@uEmd[~Bsnd@wLiyd@sC}jDuJynmApFkcE{B{x]lnM_}Hx|DytE|YerBpp|@`~GboUx{A`qZfeBrsl@leExbEpSlx|@t{Gpyf@|cD|xo@~{Dtzy@lwEbgKtt@vfbAb}Gh~s@vfEf|NriA~daAb{Ejmc@ap@las@kxA", 
      "zoomFactor": 2
    }
  ]
},
"US-MT": {
  "center": {
    "lat": 46.6768185, 
    "lng": -110.053303
  }, 
  "code": "US-MT", 
  "name": "Montana", 
  "polylines": [
    {
      "levels": "PHHJHJHKIHJGMIHJHGHJKIHHIHJHIHILHJILIHHHHLHHJJGIOHIHHLHIJIIJJIHHHLKGHJIHMKGGJIHKHHJJHJHIIIHILIIJHKHJJNGJHHIILIHHJIHHJHIJHJLHHIHJHHPJJJIKHHLHJHHILHJIKKIIHJHHLIHKIHKJIHKKHJHINIHIIKJHIKIIMKHHHJKHKHIHJIIJHIJLHHHJHHJHHOHIIHLIIKKIJLIIJHJHIHIMDFP@PHFHEGEECDGEPDGECGDGGFHHHMDNFIIHIKIHJJIIHLIJHJHP", 
      "numLevels": 18, 
      "points": "m{yoGlpkgTdbAp`@tdCu|BdlBcN`iAhiAxQpiFvfCcd@jmCznApeGefCvF}zDdjA{T`JhpCnm@zn@_vCd`Nv|@rlFqo@ppNdiBzgEj|A~vHhAp_DnyAd~AyeIbsKzg@hgLh|B|hFq`@d}GfkArT_c@zhEz_Ah|Fu}@xvC}RrvMak@fpBgbC|mA}AfcDdqBl_DtfB~vJnmDaKljHxgDAfkIeyB`kFlc@vmGqyAhiFuSrfUycBb}JzmAbxB~_Al_HlbBheBxeFj}DbcD{p@h~DeG`aA~fDeeBrdD}mChfBsxAp}HcpDpdHsLhfDc|Aq`@guDjtAesDwmAwjCd{DwpCpJ_dD`nGacGurDe_IxtBm~Bh`DkwBdPyiCx_DiuCxbA_zHx|RjGdhBd|Dn_KtFdhCsqDvy@gbD||LslBdvCooNj{Hsv@iv@mFotCuu@szAgoHio@yuDlnBkbBkTq|A|_EsoA`WybAh}Da`D{_Ax@veGq~@biCehBmP_~AvkCgbEti@i`DbvGyyIhuG{_ByGkpGxyHk{J|LulDvqEs|EnaAogEcfBkvDpRi|@~t@fKzhIcmLgzDuhB~sByv@twDqWn_ImsC}EwnBjdCocBvRcr@~hFmoBxj@~cApnFdvA~_Af{Bov@hhA~j@t`BnoFfqFfdDj~AxzEt`C|uAhg@z|F~bBliCam@|eHdiEvc@xiBvxAtpDfpKgd@vsCujCpcC}qAnhH}qDtyAi}BduDnFvrEcgAn_E`z@rpE{hHy{BgmDfsCunDihKkfC~v@e~BcqAwqDvhFwnCtj@qeB|eCyhHs_H{jEypBbSo}CgqAa~Dne@c~EuwCyzAqwFh`CubArbBcjEcvCmoBvk@mnB~`Mw{B_}@itAtzBgjDqqDicEw{@_|CjdC_v@puDm{BflAodCgy@lLgiGstAkbDq_IiG_rC`oEmx@|DkeEmeGicTohCmh@{nA_rDepA}pJxeDetBayHmeAu_AowLoi@oyEisBecEh}@am@jsHfbBnfJliCzlGqxA|zIhv@fwLseE|rEa~@z@edBmvBqhHvjH|DjxClpFnuHkp@pxEghIw^qbAddBiw@fcHmeCh`D}Mh~EijI~~GioF_p@udBweBwoBv|F_qEfeFgYp~Eu_AhqBikIt_DkfFpqIgoDhqAkc@zsCkdDp_CazIxcS}xKdtDu|@frBqt@jrKmbAdrBml@puMq_A`cCmiGziEe|E`rGy}@htFmvBblDwpC`kOyfAk@{eAemBgWm|Mwt@uoAalB}QkxAzgI}bEtu@aoAdaGkcJc|Ho}Cte@wsCr~E_{ImAswAzeGkzEp{AqfAx_HspHrmAejC~~BctAdtEyaD~rEqiJz|JwwFzcDkeA`oDwjl@pKutw@nFa|`Bti@Igwd\\Ccbak@vddAuaApwp@i@hjkAaVletB}Er|KsG`}eCjHprRoCjbr@`Fx~`AtEpuJxBr{aCmb@d_i@yC|AxgBkVdx~DzF~lGfO~yuDpE|nm@qUrj~HcAlgfAxNpnfAcKjidFkSzhe@~XtqlAtf@neFmTtyxB`u_AiJxid@I_oAblGmzAhuEuhD|`@_kBh_F}yBht@_s@r}FsvD`{Ak_BgyAyv@bYs~AvbHodEyAax@b~CcjCxzBslCjVlIf_EeuBpjChm@bnA`sDd~@}YnnHzcAteE", 
      "zoomFactor": 2
    }
  ]
},
"US-NC": {
  "center": {
    "lat": 35.23595, 
    "lng": -79.89018
  }, 
  "code": "US-NC", 
  "name": "North Carolina", 
  "polylines": [
    {
      "levels": "PJIHJGNIP", 
      "numLevels": 18, 
      "points": "{mbrEn~drMumC~bAmSukBcjO_lIaiKeeIeeIcgJ{oKs~Oh{b@xmb@`rSxsM", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PJHMHIP", 
      "numLevels": 18, 
      "points": "_p`uE|~}nMccHgaGk~H_xVg{C_sPtoD`jH~cEp`Q`iKhiR", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PIMKINKMP", 
      "numLevels": 18, 
      "points": "k`xuEtuimMgyG{gJ{`Haf`@shv@{~GquSxaBueR~gGpq\\a~MjakAfpL`mFxpj@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PJKIOJJP", 
      "numLevels": 18, 
      "points": "g}lyErxalMiar@by]{AhmF{ca@ngGys_AreV`A{sCfx~@moSpbuAgqk@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PJJLGKP", 
      "numLevels": 18, 
      "points": "ezr}Ex~knMiX~fImxFcEmqF||HLaqDfwAi}OnkLpoA", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PFFHHMGEHCMLEGLLJJHOFFFFIDIHHGJLJHHHHJHJIBELFHEEMPJIJLHHIKHHLIJCIIKHHIIHDIIKGILHJIKIKHHJLHIJIJLHJIHLIJIJHMGKJGLIJIIOHGEGFJEEHGFGHDHADFFFCCDDPJKJJJKLJINJJJLKJLMJJLJLLJKJMJJKKLJOJLJKKMDJKJMKJLKMKLMKJOLJMLKJKLKKKLOKJKJJNKKJMKJKJINKLKKJKKJJOJLKMJKHJJJKJLJLKMP", 
      "numLevels": 18, 
      "points": "mrxmEppr~Mw_LbzMiodAlxpAol|@`xgA_}Adv@_p_@dih@u[hrBsOnul@yi@hdnA}Arcm@oDxqm@giWayAs~JvsIugJzsIobGvmEhoKp{T_vDl_DirF}fFgeDt_C_yBt@kkAplt@tD~tFqyB|vmA_CvpSi_@juRg]`sm@uJ|hLrbAhhGat@`{Dv{@zx@l@jeAo~C~pBvpF|lHsW`sDjuBzhJt^tzGvzD~nOsKddE|rClK`h@fy@hc@lmM|zDfvUzaEljVptCviRnr@bmnApNpbF\\v{jAhFreb@}Cbdg@ogj@clEc~H{uKv_Cy_Ho[agN{gD{nJu{BqiAykEiIghHcnCixErf@_jHeiJkbCkvGetE}rD}s@{}HupEqrIilAybSgi@woJnfBgiIkZexIyjF}gHqmD_|LinDorGeRwuGwwEstFs{@kc@klBaz@uaAulJirEocG_Fg~CgtB{jJpt@agMqnBqvCiuNq|I{zIfl@a_C_pBzDewF|dDqhHc~EkhEk`EyPejAw_AceI}hVkO_bB|eAyrCj_C_kAbuBxsApzFsg@|k@eyGweBefH}_CkeEk`Og`LcqCcwEsqCabKbJcuHoeDctIdm@onI~mGy_FiWa{FywDceJabY{`PmjDihCmqGsvNf`@qpRmZmbCynDh`EazDhC}rNmjGehHf[mvL_lExgBol~@xn@whuApp@mbx@~e@oia@jWcsjAdLiuC{Pi{z@l@umg@gLygx@fVseMvNw{bA{NuqJt[elu@iXszYmj@_ts@{Aaz\\cBkjY_BiuuAyM{zZjLsmp@}EqleAoBu{Ko@ut_@}E}rf@h@_|NbiGqnApbAnhJzcLwmUzbCmf@wV~eE`mIuyHchJqoCzbMaUhom@miW|xFoFglE|~IsdZhmJozAlpGayEk`B{|C~aLlqWubIhuC|uCol[nlf@lsBh~ErzVuvSbfDvuD}`BndQ_}HtnKdhSmqC`~Dn`g@lcCwvJn`If`SqQtzLizIzvIrqD{aBamA~bJ_}SdbFs{YakFwmKldPgtEpx[~aNcub@jqHqrEjhEviFfmPp`Btr\\eaL`_J|fHu]kqGo_Foew@~xGmlFiuGwx]fvA{fWphGmlKt}^tvHzfMklEgpApgWnnE_fKaa@ciOotj@ooEs_Eid`@rqIynL~zf@oyBn{OpuHqgIx}Tdii@fp^rgM`cXwqMn}|@ksEjyE{qIuuMgaHmiAkfDpcMb_F_dD`eClm[fbO}y@faDv}Ma_ZbylAneUupV|xOyhw@jcNouNusFspCls@_yHfvIqrEp{Mb~XfsE_yExnMtuBtzFfoItdGrn`@syGd~PgiG|IgiC`mS`Y|aJfhCzc@bqAujTrvUqePj{D}}r@}lKxnC_\\ukZseGypO`wLabCpRgvJilEiwErhD{zAn~^|h]dwKjj]faCv`rAywKdfRhoNgyBtvC`iDtwf@xriAl`FxkHcwAnnC`kCmk@j_Tn{[||TrfUfcWtzDrk@diEazWjsEble@yLjhNv{MxhExliB", 
      "zoomFactor": 2
    }
  ]
},
"US-ND": {
  "center": {
    "lat": 47.4654075, 
    "lng": -100.307458
  }, 
  "code": "US-ND", 
  "name": "North Dakota", 
  "polylines": [
    {
      "levels": "P?AGGFDEPCEEGEHFHP???PIIHJIIIHIHIHILIHHIIHHKIHHIIJJJIIHJJIHJIIJIIHIHIJIIJJJGJEIILHIHIJIIJIIIHIIIILHHHIIHIHJIHHHIHIIIHHKHIIIHIIKIIJIHHLFHJIIKHIHLIHHHJIHPGHDP", 
      "numLevels": 18, 
      "points": "cikwGfhryQ_Gl~t@aSvwiC{Cd}]vRlv{BgLfuaHfDthwDlBvmHuJ|zlEy~`AuEkbr@aFqrRnCa}eCkHs|KrGmetB|EijkA`Vqwp@h@wddAtaA@}nsNBij_GA}|fF@o{xI`iLupA|iJ_}F`kFi[x~Brx@f_@eaBjv@tx@b~BcdDdmBur@hp@`u@vs@g_BbbClMhmBmyCjrAnh@n`CgyBruGh`A\\zzBjw@a[di@`gClhDoWnSrkBlbA{d@baAzaBpnAidCxZjuAxh@u]lV}cBhgB~v@~B}tA`nNjw@hEytCdbCnQ{TntD`{@iJfLk`CzyBpxDvVqrCviA}Gvx@zfBvImwB||End@zd@ixC|v@f|B~l@ynBpu@mEpJ~gB`j@onBtr@_EvrAzzCb`@ooAh_DrVfa@oqBhf@v}DlwAksDbWp{Bfu@hg@~zBeEpm@dFlt@qdCtbAv~Bdb@m`B~cD|Dd_BwmCl~Dmf@riCi_DveQwuBlfFqkEngGr_@r`@k}BpfGmoCxqBth@b~A_bDh`Ei`DxsHes@`zF}tEtmJqcBbwA_cCrmFhg@`rBgz@`pCzfAr`Cuw@fsFd}AzyC{bAzrCjfA~XwjBbzCs~@voCnbA|sBakAxkDxr@l`Cmw@nfFliAleBomA|vLcaAppBfnApqJc|B`uAzo@rwGgZdsCjnAli@kbAhqEoo@Z{pCfuAzs@vn@ekAbcBaJoXmzChsAme@lyIdcCnkCk|@dlE~sDvuHchBlxIjFpoDxjAjqHoTlb@ad@xuC_rA~eAyzBzjRecAn`C}}CrbGq_@n|AaeCzhIy`F|t@wgFnyA}nAfaRiWnpCghAxqC|Gb{AmgBh}NiwB~nMxvC`kMcyAxsA~^_N|caCpb@xqpCgC|_Fki@hxjC", 
      "zoomFactor": 2
    }
  ]
},
"US-NE": {
  "center": {
    "lat": 41.497815, 
    "lng": -99.68246
  }, 
  "code": "US-NE", 
  "name": "Nebraska", 
  "polylines": [
    {
      "levels": "PNEDGEOFFEFPCFEFEPFFFGIEFCMJHHFJHILGJHIJKHIIJIHIFILHGJHIHJFJHHJIPHJHKHHJHIKHJIIMHHHKHHHKIJLJHIJHHKHJHLIHJKGIJIHLIJIHHJGLEKJIIJIJHKHIIJHHKEIHHMKHHKHJIHLIHJIHJHHKJHKHIHHKHKHGHPHEFBDFEDGEEFEGCGDBGEEP", 
      "numLevels": 18, 
      "points": "cucsFdc}iR~K|x|BicbA}WwgPL}~r@}Hi}G~Dmxp@tCkLl_oB`L|`EuLvumCdCn~c@gUds|AodjAjMyka@hHodYwJ_|y@U{awB|OmzjACxZajkBsCmx_BhXkni@x`@o`hC`Ro~eDoY_{hEyFm}`CKqmu@zB_vrChtIkzFliB}|KtnFoxNxfGuyZrVknCh`B_gCbiAcGzsFgiPzMmlF_j@mdEosB_tEmrFavFixC_GmbAutLfiBafClTezC_iAodHhcCyuFywCk|H`rA}pK{jAgrKrQsnC|h@{`DeiBugLjb@yeNnhAwxFiJuoDjaActB|qD{mAfvA_zHhyCo`EzxAyoUtFe}E`f@}z@tyCfp@pe@mk@}`A{eKpkDadRbmCz@xeAidA|Gi~M|bAmrClfB}ZhwBd`C`{@oFz_KwbNdnDcm@r_B}sCadAm`CyLqiFdgEggIyCsxIngCymG~~CjJxgDjzBtrEsc@tdEnlAb_C}uEf_EwbCtbBk`D`gC{~@l_Ep^t_Bf`Dr}G{eApvG_bL|pMyyB|~BgfDzhDmO~[ynErbBcmBbyA{kFlaG_Ht`C`wArbGcwCr{LaqJroFbnCxdCzAbeD{wA~}@~cFpbAcKxvD}aC~zI~iAxnCo}DhoAldAd_Dce@jqA}}E_lA{{Gnt@kaArfB~OxrBxgB|cA_h@xz@wnIn}@epBjeLd^`uIvPxpFgoIvyA`t@_fC`tA`g@|uB`_NiwBtkBleAduAme@psAsbJntAvBrOphBxvIarBvmGh_C|_EmwBbiEnGnpDspCdhMqEp_EmLfhCfjAj{Il`@ncKdzCt`P{eT|iCi`A`fE`}@ztFmXjkBycDnr@cxGofFa\\e\\ehAlk@unAlpDq]fpBfgD~fD|_A|jP}lJ|iFoOzkAkoBf}AzItw@pkDvqA~FcCq_IdoGomH~tFovL~sAs~@jtFqb@`gGooF`eBkxDh|Bsr@t|AdwBrhEl}@fZgpCv|AowBtVubDv~CgbFri@fbCuDvawAkIlaj@bC|vm@~@|th@y@bzbAqI`{SsF`rwAuMvxwA|FhaUB|i`AdG`}m@iG~ei@VrebAuFddUmThyvAvNp_kBUv~@xGrfiBkEvzBcIpxmBbDxsO", 
      "zoomFactor": 2
    }
  ]
},
"US-NH": {
  "center": {
    "lat": 44.000025, 
    "lng": -71.643785
  }, 
  "code": "US-NH", 
  "name": "New Hampshire", 
  "polylines": [
    {
      "levels": "PKIHIHIMHJGHKIHIIHJHIIHIILJJHHJHJJHJHJHHLHIIGIINHJHHKHIGIHIHHMIHJKHHHILIIKHKIJJKMJKKPIEBJHJIHHILHHJLIKJILJJLOHHJJJIKKJGLHEP", 
      "numLevels": 18, 
      "points": "wyvcGnddxLu`@`ja@ebC~f@e{AdjBuk@vmDi_Cbc@mrBr`DuiIvyAycI}qDcsFu[}uAubB_aAi`EqqCedBedHx[ijEgqBwgFsc@kwFj{Ao{M_hBotMinEccBvo@qkDumAgbDryAmmEibBmpMytAylE~lAsuIieCe{Cs{FgwRqtDydF{qGg_By~FcvAopAqfFycCuaNe{Ak|DymHczDus@utBkeCyrBzbCmnAcQczBmyCmoCwr@{_IufGqnAiMeZviBy}BgzAa~Ef|@y_D~yAkeI_|AkhDx}AelFouCunDq_G`J_zIq_A_aAsq@sgQoe@ctAirEuqC}vAwaEkoCqoPmtB}~BotDku@en@wdAzLmjCe|BskDobEafAqpAfdBclAhDglD}yIkmBfkBk~F|uAeqAp`CmiDhuBanKrqCgiFwhHceFms@{iOulLcrGjaAmlEttC}dFg}E{aHyMycJudMiwOimD_oEhrGdFewJamJelP~yIyc[{kK}xKzrzBknJ|mjAy|Br{~A}uCzyi@aaA~n@mkB|}Aej@`iBpzAn`Bc^r_H|fAngEgy@beGbmBfyDwy@|pKknKrbCm\\f}GgdPhzMhkB`hFeiAmc@|{KrbDe~@llBn_E`|CkuBy_EmzMp`Ew{Mbmd@jqNvUb_FqqChmHxIbpChsEpiSzcH|yFgvA|vIlcAzxJnkL``@{\\jqIdlBniAtjDjxEki@~zvBkJ|uDyqArhcA", 
      "zoomFactor": 2
    }
  ]
},
"US-NJ": {
  "center": {
    "lat": 40.1536165, 
    "lng": -74.7332
  }, 
  "code": "US-NJ", 
  "name": "New Jersey", 
  "polylines": [
    {
      "levels": "PHHIFHIKIFHKHJHKIGHHIIJINIIIJGHKHIKIKIJKIGGHNJIIKIIJIJLHGHHLIHIHKIJHJIIIHOKFDIPHEIGILKKGHMJIKMKKJJKKKJMJJKKJJKKJKJJOLJLJKIMKKP", 
      "numLevels": 18, 
      "points": "wxkqF~~vkMu_@crA}fCoFqeC}xA_|AukEagAibBox@nu@stHypMrQg_Qo]ci@ugDu~JeY}iGs~Agk@okFzeAkcCsl@{`CqsD~DycDk{@mfB_jC{jCedDucKutCmiDg|BwmOemFekGer@adO}zCaaCspDlrAayLrhSs~HzkFgyA|{FkzB`fAchApmBqoJplCaYtkDpl@z`CytBhaFo`F`nAssKeg@ewCpcBsxBtvG`q@~gJyuAp~AypAmXq`E~i@sxBiNifBpcAavBezCwdB|cCekF_mB{uCxc@sfDypCdL}xFouBcyDyxDyeAwnBr_AoeBywGieBtJsmAnjB_tBxd@msJt{IezArV_mCylCm`AmbHglBaxEguEetEe}B{xErDflCcmB{Y}lAiwEyuDa{EmyKgcIg|B~Ti|Iq`GemAcaEugBmNipFo{P`f]qa_AzjJaiXrvAivDvlWcx|@jjFkBtpE`oA~`GzrAlhPttIntJnuDxqEMxbJ|~V_mJqsAj{DxbEzmOt~Jn_NpxL~zHk}@~|BqtGep@m`S|}Wq_[bij@~zJ_xAdeIjmDwn@yRgtHrvEx_Bb`@ncM~x@gwG|}^v~N`i^fkA~kQ~|KvcIpvOxmHla@uuB~hO|xFmeAdyMrqJn|GuoAjiQ~ch@bb@c~Ep_EzKzyj@rua@fcFb`NfnEoQa}Ax|PiwZ_fNyaJjdDilD|aRntAvrSidd@dwx@cqUxwYkzMo`Fw~HtmI_~Q_yN", 
      "zoomFactor": 2
    }
  ]
},
"US-NM": {
  "center": {
    "lat": 34.171596, 
    "lng": -106.024373
  }, 
  "code": "US-NM", 
  "name": "New Mexico", 
  "polylines": [
    {
      "levels": "PFDFEFCPFEFHHEEFGDFFPJJECGGEIFGCFFHGPDFEHFE@ENJIHIHKMFMNOP", 
      "numLevels": 18, 
      "points": "ui_eEhvqxSk|`ArJacrAcDk|oBc@_||CsI}zeAqKqojEpF{hbE~BwPa`cClCaxnDvFi`KwHysdB|z@_uDqKu~jA}Ccx|AeM{ku@hKiv`ByBgaL{Fib`Fc`@qzqDvF_tNlzaB}@zCxyD`atAgSzg|@_HvdV_AzdvAbW~nh@sDpzi@gOnmtAxj@fa}AnU`zq@fa@dvc@fZbzqA|e@`qtAxaAdasAmZhfOlPcMfpt@cKtolAf@nep@sG`lFzXpmaD_Ff|L`PxbrEtDtghAcAv{n@v`CfdDtq@clBdjJ`FbuBr_AlzHumDbgDcF`dEuvMtFfipCkJbsrD~ouAdm@nApabDequEdW", 
      "zoomFactor": 2
    }
  ]
},
"US-NV": {
  "center": {
    "lat": 38.4977645, 
    "lng": -117.01686
  }, 
  "code": "US-NV", 
  "name": "Nevada", 
  "polylines": [
    {
      "levels": "PEFEODEEDEBFPGHFEFCPDGEFCCFHDFNHIKMHJHJHLJGJHJHNHIJIKHJHJIHHJHIKHJHLHJHIKJJPBJIFHP", 
      "numLevels": 18, 
      "points": "uhmiFz}fvUsoUxn_@wia@jdq@}yi@hg|@a`M~tSupLSmiGyBugIbEez\\m@uwXlC}bu@\\}p{G`@yo}C}PdAaj|Bso@yxbFpJkybFd@ufpE_KwesDtBgprChB__l@rzaEuDpdlDIdof@zI`hgAr@~{fD~XlaTbD`tsArLxhhB?dqtBySve]k@jfyBqf@vhCfo@pfMrfK`oNzcC|wCzdNuE|eDmqGfnMmzCkVawClkAyaD|nDksAncF`zDtiKyUrlC}|DvnKvgBhjLuUtlC|dFtxPbwBf_B~hD`DnhCqeA|qHxrBdzM{eFraEmjFlz@jD~qChjDbdOqk@rgE~d@|uFisCjdFdTh|@cyAf{EwwAtdD~qAvmF}S~_EdkCduKsfDl`Qy{I`nIsItoO{oDl}G`HfuEbeAzm@v_AkGzpGh~Adz@fiGuzFvtEjmFjkGmnA}rzC`icEocg@huq@ydzDr}wFse`BbncCqzrA``pBcqeB~pnC", 
      "zoomFactor": 2
    }
  ]
},
"US-NY": {
  "center": {
    "lat": 42.756058, 
    "lng": -75.81661
  }, 
  "code": "US-NY", 
  "name": "New York", 
  "polylines": [
    {
      "levels": "PIKMJKHP", 
      "numLevels": 18, 
      "points": "kifvFzkbdMmfE?e|OmxLs{C_gQ`jHotA~bJvmKttEpxLn[rmG", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKHHIHFNHGIP", 
      "numLevels": 18, 
      "points": "ys}vFpma~L}D~qG{h@{J?_|HafGw~c@scKg_a@mfDynQ}VqzCxz@|h@vkJxpd@jrDhqM|}Gdri@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PMIKKKLJLKJKMJJJJJLLJJJINJKJKJPJLIEP", 
      "numLevels": 18, 
      "points": "glpvFl~ebMsyJum_@{sBbU{`B~yNdeClrLh~Fk_Flw@hgWajJ~rCipRuaMygJu`Jtr@{i[_~IyZijJ}o\\dqCenVqjGogHleCwei@uyHujMoiBekVgoAsbkAky_@}l|@pi@g_F`iEbhM~lO|bKbuJlhYl{JnoIw{AkcXehS_wb@_fAwoPpxEutW{mOe}\\v_AunIpqGloH`bi@lttBv_]n`oDb`Lpk_AxeF`ga@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PIGIEHMIDFKHHHJHHIHIMHIKHIHHJJHLHHGJKJIOHFEEHDFDHEEEFFMPJJKJNKLJKJNLIKLJJJNIKKNHKJKMJJMKKOJLHPHJKIJJIHHKIFILHJKJHHHKHIHIJIHKHLIKJHKIIILFGIJHMHLIDDCKNLHLJJJP", 
      "numLevels": 18, 
      "points": "{~lwFtiubMyqELotJouDmhPutI_aG{rAupEaoAkjFjBwlWbx|@svAhvD{jJ`iXaf]pa_AaxCp_@aeDtzEu~BmAoq@l{Al@hlFujBl|LlN`bEqjBrSmkCjsEvCftFw|IhlGacDx~@wpFxvGwt@fOmvCccCocN|vAeiAss@eoGdZ}u@z~EopB_A{hBciBwmC`lFgkArj@gh@`rCijAtnCoEfgOakNjuDmtAh{FidE|eCma@fgFlKx|QqRxayBgFbzFuMbypA|A|dfAyAdzF~Xty|BhH~xXkDjuxAsFduRuA|xvBeG`pZpBl~jBwNbd\\krr@vHgu\\aj}@cnMclPezN_ph@}iWofRkgQo`c@gmb@nbNykHcoIusGrjG{tC~mYiqIcgCwbW`nCsgSyusBbg@ai{A~|Dwfo@dhQca`@otE}ve@aQmkyA{oKuua@pwBuqB}uPwhR_|Ocf_@_mIihl@amNumFitHzbCuw\\puEqbNg`HezBasKkyN`a@ifI|aLjrCxrQc_Jn{Kk_x@ypcBozWsmPyfx@c}rAo}YmkeA{sGikl@~KaqjCq~AaecC~uCtd@rsHsxAbpOx}GbsDyqAzzBggGbtMx`HbqGu|AjvBj|AhgDmQzyA~gA~|Fw`Al|CyqCh{@mrAtwTe`GviDth@jmFfyDh}SywCboJ~`MbuDp\\f_Ff`DbxDnD|iGldDxpB|CtjDmlDpzDdx@tiMmjAfsD{{Dd|Nb{@~aD{_DtgCoMdgGnxAp`OxcIduH_\\jrAy{Dq}GuwCw{@}vJr^_z@ldDglAlpBj{@x`BkcE|aH}eCjmf@`hA~jgA`aD|cShUvpEtfBl}IagDzGaeAbcn@vbQpmrA~{[vzDgzAzpiAtlEj|ZxqA`w]zuA~~Lhd@zdO{aM~pTngo@jcP}}L|wAsB`yTbxWvrIzdBnwD|bWrhRpzO", 
      "zoomFactor": 2
    }
  ]
},
"US-OH": {
  "center": {
    "lat": 40.193678, 
    "lng": -82.66604
  }, 
  "code": "US-OH", 
  "name": "Ohio", 
  "polylines": [
    {
      "levels": "PHJHIJIHKJGHIKGJIIKGIIHMJIHIJIHJHLHGJGIKHOEBHF?AHDEFEDFAPCFDFMJJJMLJJNHKHLIKIPEGGFCFMIHILHIHKFJILHHGJGHIHJHGKHJHIIKHHJIGOHGJHHHHHHHKIHKIGKHJKHMIHJIKHHLHJIMIKHILEJJKGIIMHHEJJHLIHIKHIKHNGHIGLHIIKHJGKHIIMHIJHIJIIP", 
      "numLevels": 18, 
      "points": "wzsjFxeg{NzmA~jB~@~eBa_AfuA}}Cr{@wnCtaGyu@v`OycDjaHkd@ndDlpB||PdpAz{A|tDb}@|iApmAlQhmCmzAjuEk~AveJ}kGn}BuoBdeHomE`|BqpAtvI_zBduH|uAt{PcJdzEsnChdPgvCpcIsaKfh@ikG~bDahDxqDsqLzoCisCziEzKp{GmgAtpDuhFbd@khDfwBzZreHhqAfpCptC`eNe\\xwDyzAhwGufIdvMzyE`eHzZveCycf@tBk`h@aEa}HM}}cAq]c|QcOotz@er@upEcD_`m@eGyjZe@wtq@yN}ur@pEw~DyBoc[xDe`SgByr_@gEk{@mhnAoDk|Cwp@ay~AqEgmSoq@{|u@|iR}f_AldPoj\\jBopg@z{DodAv_Inxv@leDap^qbC_od@|pJsy_@_zFqog@yjOcs~@trAsnIfbAisj@omZmyq@oaQ_tUkrWsxeA{tY{q|ArqYzK~mdA~Ffc@qW|feAjQdkl@oKjlG}Bbki@rIrcCpfIqX`gF`e@d`D~eE||DpuApDvtD{zEdxEer@ntCiqClaOpaDvz@tGf_B}{BzaLq\\zxDp~@t_Ej|E`aIxpDfaDpjC`wAjFfcV`aFdeI`CxbF`vC|_DaYvp@vx@yg@hmDrWzhAvcAxYljE}cCr`B|n@riBdjDt~Dui@fqHvaIzrCgxAjlB}uCl_BbB`oCl~DdoBdy@pnFjs@ngBtcEpAb|B`|C|}HljFzpHxfA`]faFh{JfrDxtBjzDvkKzgCjzBbn@~xCf{BfnAvG|`H|oEtuIvp@tfFcxJ|iJg^hvA`YriBjqIrwMl|BtgB``Lr~As[toQd_ArhChzFfs@bi@j|CniF|~EvvHwwAvaEhv@blB~kEn@pnEfaAj\\ljCobAniDekFzlHxd@rnFmxBjh@xaCszCl|FbaA`jBbeIx`DpkAx`DucA~kCk_AxfBgiFynEidIruDcj@~|@mJ~hFcjC`xC`F`mGt{Cp`BdiAvdDz{CddBjhIdmFvyJji@rtEraIn_D~uB~kL{kEpiEf^p|Gy~AfgFdaAv~@zvDy}@vdJn{AdvBzlUtvClpCl|AfsAvxK}J||BlxCpsNh`@ngIeTdmD{t@zdA}vJthDewD`}IifFl`D_vAt`HkYrxJyxA|xC_sDzfDqcIre@g`Ez{Bc~Esi@osC~iByUt`EhfDz~Hb_@lsIzrD`sEpaCxyHj{GlfEhz@lqFqxA`iKf|AplD", 
      "zoomFactor": 2
    }
  ]
},
"US-OK": {
  "center": {
    "lat": 35.3112945, 
    "lng": -98.713135
  }, 
  "code": "US-OK", 
  "name": "Oklahoma", 
  "polylines": [
    {
      "levels": "PE@EAJOHIIGJHHJGJHHJHIIIHJGIIJGHJIIIJJHJHIHJHIHIIIHKHHJHHJJHJHIHJFMHJIIJGJLJIIIJHGJIIKHIHJJHEKIHJGLHJHIHJIIHIHKHJHJHKHIKHHMIHJJHJHKIKKHJHLJHHKHHIMHIJIKHHKHJJJHMHKJHHJLHJHJHJIIJLJGJFIGKIJMHHIIHPHHKHHIJHKIHKJIMFJHGKIIGHLIIIEKHIIJHIGJHHMHJHHJIJILIHKIHIKIHJLIHHHKHHOGFEGGDGOFFEGEGGNPHGHEEFFEGGDECFGGBFFFGFDGCPGEKHDHFEKP", 
      "numLevels": 18, 
      "points": "cbetEvdl_Qrxd@nh@zjk@th@~z{@rw@`hq@`j@b_{@tq@vv@xuCoo@d}@d|@ryAmhCek@n_AfhEyPviAql@D{`@q}BqrAvTbz@baEqSliAwh@cSoDu{Bsv@a[~GdnBet@fh@rrA~aBiqBj_EduA|j@vf@rzBoM`cAw`@gHue@qrCozArdAoY`pA`f@zkCscAt{Hug@boAmeAglA`Mv_Cm{B{oA`RroEyt@aFcaAqnBsAxwBptAfzBm|@pbBP`qFi_DlsCmzAphEwuAk`@onAr{@lAniCk{CeBil@b|BkpB~u@t}@p_C_uAzqCzTrxCooBla@okAt}B_bCbAjuDx|Bys@de@seCom@oSxpA`z@btCk]rm@esC`GyOd~BgdCxvOrpDvjBlcEy@bl@zmA{|BxtA~`Exw@v@~_Bq`AfuEtbDue@h_@vvVe`CffBl\\`_EccBtvA|iAtaEkm@rTa\\w`Cev@uk@hObfDegExeBat@rmGbp@xu@xeBqJZd_C~|Cx|Kst@veHf}@nuAfyAdUpkDrY}qApgDffCp}DlKt_CitHv{OnBn}@xzC`aBfk@lsBykB`hBjKrs@neBeDznAvkAyhAfnAb{ArcCqSdoGv~A~nBuf@`vFhh@n}BlqA~uA~l@_N}_BwbDtU}pA`iCj{BlsDzm@hbAvpBzJp~CmgBpxKrfApgAhjHldAnkAv_BgVvbE_yEbpCojH~nHv~@pgLg}@prAokDl|@y{@faIslBbsFs{B~oAynEmxDwkB|}Nrx@tfAr_J~`BvvAhqBhLdgF{mFxoHiJhfBxtAxyDyUhiBojC`oBu|FjW}}Cp`BmhAlaE`vAnh@v`A|fE}i@|yBpfL_@|`DlpBf}@lzBadBbzGbb@neAbrAqWtxAkoDfbBdjFfvKeYbbA|j@zb@r{CcPteFsuChdF_aLvvBefBcrAwgAcdD}~AsZi`FlrCog@frCpfA`xEzcC~[~wApqAouAjs@mpChdGb~ClD|s@vfD``EneCn_AncH}_BhiG{qIbZuiArb@g`@f{Auw@d}FjoAlbFtGvbC}~AfgBgaI|o@yvB`zLtiBnnEnhEvyC~k@|iDfcGlrEroErdKfKpjBeuBvtFcz@l|GyuBhfCwz@q@{~Ba~CycB|kAkdAg~AifAnNi{DxiEjxA`~FqPjgE}_Bp~DgrK`xCosKofBgyAp`C`aAphC`oCz_Fym@~iSmfBxnG{O|yDrcDprEjqDzh@z\\bdBzfBxwApfAxfDejAz_IgrFziJucFftBez@b`E_k@dtBffAh~EoQb_ClwBfoCwFthMivAjjE_|AvtN}qEh}Jg|A`pG`aA|rF_z@~lG`j@ntHkeAhlHycApxAkfEfwAitH{r@yfDlx@maFxnH}zDvpAeyAv}IgiFt~FncCtqDphEnGxkDvaBlZrpDqtBt_Gm_CxlCkdAhbI`f@|tCjuCbm@zdBjdBov@phO}~K|bQchJpeIihBn~DuwDd|Bi`Et_I{AdoAtmB~iDyA~tCmbc@jPylv@qP{o\\`F{in@wP_}d@hb@cwr@cM_}`@sBo}sA`XmGtb@tZ`~hB_@|qnAzHt|XyWrsfB_ExyoAdP|qXkLfmaDmzaB|@j{@ma}D}o@y}zAyC}c}A~CisVgFcx|@b@oqiB|LemPIkxwAtDy|S_UeptA{@suxAgCuud@lAkkn@Twsy@`LwdaA{Sg__AgAe~jAsAmyk@`MefcB{IokHfKks`@cQgvq@nAgiVkDyj`AhC{sFjVgpoA~ql@`GrdQyB`kb@yVlaAi|@bk|@qrIpgJ{aAxtbA_`J`hVclBl~m@oxFda{AfbA", 
      "zoomFactor": 2
    }
  ]
},
"US-OR": {
  "center": {
    "lat": 44.111868, 
    "lng": -120.515018
  }, 
  "code": "US-OR", 
  "name": "Oregon", 
  "polylines": [
    {
      "levels": "PGHBHLPJKJLMJJKJHLIJKIKLJJMKJJJKKPKJLJJJLKEJHJHMHKHLIIDIIHMHIGIINHJHHIILGIJEIHKHJHHLIIJHHJIHGKIIKHLIHJGHJHKIGGIGKHNGFDFMHHHKJIIPIJLIIJHKHHGIKHIHIIJKHFJKHHHHJHHJINJHJKHIHHJIKIJIMHHKKIIHJHIHHLIGPGGEHP", 
      "numLevels": 18, 
      "points": "o_i_Gl`fdVcg@~tcD_HtavDfZlzw@p]bwz@k\\psjAmvRhn[aw[pgKg{b@fmCkbW{~GorLhy@}}g@x}]w_WeoMixz@cgRipFtwBg`^oxX{n[}jHsfp@_fLqpoAayFytkAmnKwx\\dcCofj@{gLmdq@q}Hwod@ttC_nCgqG|rEquGk{CwjEaqL|iQmfYmkBaeMl|FgtQc~B}yLlzFawLwuM{dd@z}IjyPexb@cmEiiBsrHjqGydBisJfyFssGw[gdH}_Kq|\\p}Pe~\\sBwnJlCo|ImaDibF{sAmaFxYigJhrCugLxyGs|MvaEcpMzdIcwCrgO}eLxwFoHdaFoiC~kBxAbxHxTrwFgsCnlErr@hhN_jAtqBkpKjvC_yG`jAcwOtzDu`XuGmwNfoCalIk^_kJ}gG_y^wiDu_OcoB{iDcf@q}GuxE{oF}sCwaNpcAefIxDueIk_Eqsa@vxCq{OhZi_C{w@yqI`R}iHlqBooGhnAgcKds@ocAhrGieApnA{mB{g@}qHevF_bI_f@gyF`o@iuKg_@m{Bv{A}|FuxDwaHgzGub_@ciCepFycAowEzOonI`zGizLrf@q{IsiDke^_Sg{MgbGaaIkuBm`Pi`EooMo_CsiW_}@caFgcAmh]_dHa_J{uAclEdwAw`Nc}AmiM}SkrJ_}Ag~Mj_AcfW}SsoFq|FebT{kE_xHcOah`E~Iq|@mAaeiAtAgtVb\\yzlBrzA{aCv_NwcGzgJqvK`bDwlBtBywL|oF{oHnnE_iQjdFgiE~_HorA|jJcuGfzFxq@pcMtyMbrEleAzhWrxSpgMjfBplWpiHv`EjyCri@`hBhsC~w@naDr|B`lE~eHrhBag@n|Bto@jr@ko@qDugBdnB~cBzwE_kA`aI|dEl|Bh|DpyBrkAriItdGfgDnePfaIjgDjr@foA`yUt~HtqA~rA`yCtFtmCzfGtaDrfB~nAv~B`yG}k@vkFbzBzzHw{EhqF`bBtbBgWbcEwjGzOqjD{vBe~DbPyjAdpCyvBxkAovDcnBmfCdMijFxgCsfBxiDzb@l_CamLr`EqbA`lI~uG`PnfBneBprAbtJemGt}HxuElwEor@xuCbrBp`E?fwAtn@zf@h}DnqAub@jr@~iBhcEhz@faHirAvqMrNn}gImm@qJjybFro@xxbFeA`j|BpHhqjDsh@~fnB", 
      "zoomFactor": 2
    }
  ]
},
"US-PA": {
  "center": {
    "lat": 40.9933055, 
    "lng": -77.613058
  }, 
  "code": "US-PA", 
  "name": "Pennsylvania", 
  "polylines": [
    {
      "levels": "PHAEEAGDFCFPDBGEEEGCGGFEPMMFFEEEGDHDFEEFNIIJKJGHHLHJJHHIHKIHLIHIHHJHHPJHIJIHJHJIJHIHILHHGHLJIJIIKIIJNHGGIKJIKIKIHKHGJIIIMIJIIHHGIKHJHOHFIJKIHKIHLDA@FEBDDP", 
      "numLevels": 18, 
      "points": "qvlqFt~zwMoc@~bxBpGhrm@dA|xH|BbqsAzCp}T|QdbzAaEhnOqH~nv@Zb|\\jJpwbBqGzqQqim@lAoqKz@ahZxEg~m@mNkxMxCc}]sMcki@sIklG|Bekl@nK}feAkQgc@pW_ndA_GsqY{Kywu@o|rCjrr@wHvNcd\\qBm~jBdGapZtA}xvBrFeuRjDkuxAiH_yX_Yuy|BxAezF}A}dfAtMcypAfFczFpRyayBmKy|Qla@ggFhdE}eCltAi{F`kNkuDnEggOhjAunCfh@arCfkAsj@vmCalFzhBbiBnpB~@|u@{~EdoGeZdiArs@ncN}vAlvCbcCvt@gOvpFyvG`cDy~@v|IilGwCgtFlkCksEpjBsSmNabEtjBm|Lm@ilFnq@m{At~BlA`eDuzE`xCq_@hpFn{PtgBlNdmAbaEh|Ip`Gf|B_UlyKfcIxuD`{E|lAhwEbmBzYsDglCd}BzxEfuEdtEflB`xEl`AlbH~lCxlCdzAsVlsJu{I~sByd@rmAojBheBuJneBxwGvnBs_AxxDxeAnuBbyDeL|xFrfDxpCzuCyc@dkF~lBvdB}cC`vBdzChfBqcArxBhNp`E_j@xpAlXxuAq~Aaq@_hJrxBuvGdwCqcBrsKdg@n`FanAxtBiaFql@{`C`YukDpoJqlCbhAqmBjzBafAfyA}{Fr~H{kF`yLshSrpDmrA|zC`aCdr@`dOdmFdkGf|BvmOttCliDddDtcK~iCzjCj{@lfB_ExcDz`CpsDjcCrl@nkF{eAr~Afk@dY|iGtgDt~Jn]bi@sQf_QrtHxpMikDntHysA`dUhJlyJpnBl|Hp{Gr|HxyHhvDhC~cBfIz~bAhAxiQ|Hnw`AeEbbj@hAlhg@h@pxj@vBbpn@xA|eA", 
      "zoomFactor": 2
    }
  ]
},
"US-RI": {
  "center": {
    "lat": 41.66823, 
    "lng": -71.491909
  }, 
  "code": "US-RI", 
  "name": "Rhode Island", 
  "polylines": [
    {
      "levels": "PJMKJP", 
      "numLevels": 18, 
      "points": "m{}{FpmnrLmga@guNyxAwuH~k^bwB{u@jsHbkFn_K", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PMKLP", 
      "numLevels": 18, 
      "points": "sha|FrfqqL{_i@aFbpC_gJzt^muCzxDndO", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PHJJKGGINFOFJKHHHKFIMKCLJJJLJP", 
      "numLevels": 18, 
      "points": "gze{FxmsuLaOguByfBacA{aK~w@yiAkmGifc@mmAw{FbNarNgZsev@|z@e^qty@{ZkeVhvEnVtvPtHmn@}|Hp}Bvy@vnBsp@pvGhcArrDob@jkA}~BjkCkhIxeGkjF|nD~vIiaKbhOwzBvbDthJsxCd~H|xHni_@nq@jnQ~eKbtKlkl@~Zre[", 
      "zoomFactor": 2
    }
  ]
},
"US-SC": {
  "center": {
    "lat": 33.6382505, 
    "lng": -80.9650675
  }, 
  "code": "US-SC", 
  "name": "South Carolina", 
  "polylines": [
    {
      "levels": "PJMKP", 
      "numLevels": 18, 
      "points": "gm}bEl_hlNca]s`IysAooHrdI}fIhpU`y\\", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PHLJJIIJIIJHILIHJHHHIGHKIHIIHHIHHJHIIJJHJHHMHIHHHHHJIHJHIHKHIJJKHIIIIKIIJJIILIIGGJHHGKHIJHHJHGIHHLHFJIJHHJHHIHLIGIKGHHIJIHNGIIKHJIHHIJHHIHHIHHJIHHIPEBIJHJHHHHJLJGHHIDIFFFFNHJJLLGELMCHEGMHHFFPJJJKJKJLJMKIKKLJJKMLLKJMJILMJJLILLJKKMIKJNJLIJKGNGLP", 
      "numLevels": 18, 
      "points": "}hvbEvkvlN_hFvkh@akA~wAagMoZsrE`mE{nE`BkuByuCy|I~o@abBn}@x{@n`BomEffCa}AmDipElfCqsG{\\i}Iz_GerAheEqaCnf@}lAfyCoXzaG}jAjdApH~}A{f@uA}m@psByxD|hDq|C}mAg_Fdo@}{AlrAozFuoA_q@h_Bgj@oj@}vDnwA{pCwy@qbAdz@ufAsf@}|@fs@aQtnCsfDbSk\\dyCefCspB^`jAkuHnnEer@oAqYsiAeyGg_@{p@bcBqaEfaCn@zoBajBjlAi}@t~EwiBr}AezEffQ_gCn`Fc|C~nCs~C{VurBh_AwTf}@~y@xfCwrBlx@siB`mG{iBijBknA~QfWyqA{kDhtEkeAy_Cyl@~}Cfv@veAopDxfB~QjsBckBiC{Dd}C}eDbs@rBiwBodEvyAol@efDk`CptA}}AoaA_zBlzBgzBjuG_yDr`B_qBnrCyu@~qBwcDthDsaC|{HjDdlCedC|nD{t@p{CsbJrhC_{@h`Cm|LvbEmbCptF_dC`b@ucEdzF}B`yAgpBpzCge@~rEioBrgE_iIt{JsoDfpJa{@yQguGzkCscCli@wkMzeJa_KlvMm~Epi@ylDl_BmhHle@wz@zsBssHp_DsaEbmDgcGzn@mwGttCw~BhfFfHv_Nnb@jaDewB~dHwsDduCgcBztDilEvuD_w@|eCeiC`d@{xAtaMeuHzaKc{Ar~FwfEbcA{mBeAizCegDyyEsCgqBo{Bwz@_kE{uCuMaBmkBi`AWikAizAeaB`m@tYe_A__BqrAf^obBkdDidC{j@{sCkzAyShJclBo_AsiAb\\imAaqB|wAug@ad@ve@sc@gwDg}AedBpb@qtCwiR{aEmjV}zDgvUic@mmMah@gy@}rCmKrKedEwzD_oOu^uzGkuB{hJrWasDwpF}lHn~C_qBm@keAw{@{x@`t@a{DsbAihGtJ}hLf]asm@h_@kuR~BwpSpyB}vmAuD_uFjkAqlt@~xBu@feDu_ChrF|fF~uDm_DioKq{TnbGwmEtgJ{sIr~JwsIfiW`yAnDyqm@|Ascm@xi@idnArOoul@t[irB~o_@eih@~|Aev@nl|@axgAhodAmxpAv_LczMzeBrlGbkAadFhxYzos@ha[jn[puZ`nVndU~uDk|Cxp@vzGp_UlcU{mLrfGzkDisA|gVdcBg}HduEg}@tvPb~VmLjp`@`zE~xE`|I}wDt`DvvBhoSll[~Txh]geZu_T`xLn}SuuIloCh|@dfE`hQkwAx~M__Jx`Jp\\t~LlqRdsGtyh@nfJ`rNgp@f`Jo_[bpGauA|{Cha_@edBga@txNigHnrLzjH{fAkw@~~St~ByPldLgw]nfJmmGruIzlBt}Gfj_@goA|cI}pMtnK{aUzeJmeEgzAeeAz|GqeB~cF|wXezGtx\\caGtcb@f}T", 
      "zoomFactor": 2
    }
  ]
},
"US-SD": {
  "center": {
    "lat": 44.215994, 
    "lng": -100.2502175
  }, 
  "code": "US-SD", 
  "name": "South Dakota", 
  "polylines": [
    {
      "levels": "PGFOFEDEGEHIEEPEDFGHA?FDHGPJHKJMHHHKHJHNGEEFGFFLLIJHKHJJGIKIHKLEJHJJIIIHJHIIHMIGIJHIHJPIIHKIHJHHLHJHJJJHHJFJHIHLGHIIFIHJJIIHKJIHJGMIHJFHHJNCFEHFP", 
      "numLevels": 18, 
      "points": "qoleGjzjrRiXjni@rClx_ByZ`jkBm~{AnQqxCyFoecAxHwex@p@_`FdGitkA{HsrqAlA}AygBe_i@xCs{aClb@quJyBtJ}zlEmBwmHgDuhwDfLguaHwRmv{BzCe}]`SwwiC~Fm~t@ji@ixjCfC}_Fqb@yqpC~M}caCpuUlbC|z@bgBbpL|hIvfPfga@xbGtiCj{CiiAh_LqlMrqJabEdhHkwGdwAsePtdCidMlbHovIhxD}{B|rCkR|ez@zHpi`@kDhu`@jHltPaIngaAhMnlcA_DldcAbWYr|Y`oBwyAz`Hd`@pxEgcEbfBakEjiDqLbsHnmB|lB~oFldDqs@r_AwdAdtAlm@lwAks@jn@a}Lbv@gwAjdOafCfoFby@vkA~FrtAhlBx_At{FruFebC~~CfpB~sEwLtoFhvD~hBii@~xH|sB~kAvhBmEvyAz~EtqA~lCrgEloDho@pzFswA~wFykKbe@wgCbkE}oD|rHewChh@xlAp|@qgAbdHyw@hmDi~FxCrxIegEfgIxLpiF`dAl`Cs_B|sCenDbm@{_KvbNa{@nFiwBe`CmfB|Z}bAlrC}Gh~MyeAhdAcmC{@qkD`dR|`AzeKqe@lk@uyCgp@af@|z@uFd}E{xAxoUiyCn`EgvA~yH}qDzmAkaAbtBhJtoDohAvxFkb@xeNdiBtgL}h@z`DsQrnCzjAfrKarA|pKxwCj|HicCxuF~hAndHmTdzCgiB`fClbAttLhxC~FlrF`vFnsB~sE~i@ldE{MllF{sFfiPciAbGi`B~fCsVjnCyfGtyZunFnxNmiB||KitIjzF{B~urCJpmu@xFl}`CnY~zhEaRn~eDy`@n`hC", 
      "zoomFactor": 2
    }
  ]
},
"US-TN": {
  "center": {
    "lat": 35.834211, 
    "lng": -85.9788575
  }, 
  "code": "US-TN", 
  "name": "Tennessee", 
  "polylines": [
    {
      "levels": "PJIHHLJIJLNGFGEFDAGCECHBGEFIHHEEFDGEEFEPJKIIJHILHHIKHILIJHIHLHIHIJLGHKHHKGLIHKIIGLIIKHHLJGIJHLIHJIJIILIHJHKHIMIHILIHJILHIHLHIHLIILIHKIIJPJIKHKCAEEFEMHILJJDGEDEJDEEHHHICHEBFKIEIHHFDCIDFII?PHIIKILGJKGJMIIJILHIJHLJIJIHLJHHKIKIJHLIGKIIDHIIHHKIICKIIHP", 
      "numLevels": 18, 
      "points": "a|kwEhkl_O~iHdiJhxEsf@fhHbnCxkEhIt{BpiAzgDznJn[`gNw_Cx_Hb~HzuKngj@blE`Abrx@mKxw\\_L`vD^nu_@`Ubqy@gDl_Q[n~SGxsZ{Lv{q@gRdwsAd@tz@gJdtzAiF~}Hw{@rahAzBx}A_SnejAia@h{hApNlxg@xw@aEzBzx]qFjcEtJxnmArC|jDvLhyd@_Crnd@tEld[yDblz@dH~xLqH`{qBoiHqsAhn@uwQyeFkeDs_Ezx@_bCuuAij@s`CxfAa{JsjC}qBayBeLuzCzbAuaCaZkcGdcCaz@|aBi@t_HurBbmB}rCwnAys@o{He`Eyn@k~Bfj@a`BorBi{C{gAohAn{@tBhhD`~@j}BnxCdo@qFvkDsuFl]qtBg|EaaEy{E_\\izBtc@cm@l}GuDzpAgtAaVosAepDafHsaL`gGa}DwDyz@ap@{x@unGtvDsiDr`@a{AoMieBehBqz@kjEjbFcxCcE_|DqpNlUatAu_BmzAq`Dfq@_Mrp@hkBloDy}B`bFiaFhjCegCgEq_Cy`Gnh@}vH}}@elEubBuhDybEmz@eiAg~Dz_AatC}~BmzEyyAxBsvDt~IgnApt@mnAaTypB{zCnUopCb`DwwHau@u~A{xBqWcuCltBeqDzpHwpE|t@}`DylEgdJuaAgeBkbAo}DifN}iCFeeEztDagF|jJq{B|tByeA}EiPytCpvAcgImeBu|Mml@gf@_eB|i@yhDfrKafDdcBy{ByiBjw@c}Jy~@s|C_yGbCmxFj|Cy_EguDkcDhjBuAqeJvmE`dB|xBgcCe`AojC_`HirENuhLdPyycBIaXjDy`BcByey@jG_gBdI}owAecG_o@euGpd@a}Q`|Db_A}df@lmDijBqQag^_]gwbAsK}tl@bBeuGcGicy@oQewq@xXerQxn@ygi@r~@{si@dg@sbe@~s@s~bAkp@}xY|^c|y@d`Bmog@hAix@`{@e_fB~Skko@`Dw{L~j@{zm@kyAw~BYoeh@eIk}c@x`AoeDnJaiF}Roxj@n@ovYcBqtm@s@mi|@eMetNwEoeK_Dq|j@imBycApKumPnW{na@|nBvlBlvL~kEdhHg[|rNljG`zDiCxnDi`ElZlbCg`@ppRlqGrvNljDhhC`bYz`PxwDbeJhW`{F_nGx_Fem@nnIneDbtIcJbuHrqC`bKbqCbwEj`Of`L|_CjeEveBdfH}k@dyGqzFrg@cuBysAk_C~jA}eAxrCjO~aBbeI|hVdjAv_Aj`ExPb~EjhE}dDphH{DdwF`_C~oBzzIgl@huNp|IpnBpvCqt@`gMftBzjJ~Ef~ChrEncGtaAtlJjlB`z@r{@jc@vwErtFdRvuGhnDnrGpmD~{LxjF|gHjZdxIofBfiIfi@voJhlAxbStpEprI|s@z}HdtE|rDjbCjvG", 
      "zoomFactor": 2
    }
  ]
},
"US-TX": {
  "center": {
    "lat": 31.169718, 
    "lng": -100.07873
  }, 
  "code": "US-TX", 
  "name": "Texas", 
  "polylines": [
    {
      "levels": "PEJHFIHIKHJHOHIKGJIHP", 
      "numLevels": 18, 
      "points": "ufc~ClkcpQi{a@xwDscRvkBeyLzzCosJ~bBq|JreAs|JdlCcsSrbJueUrpCczRlvAw}c@~a@ctPwjAoPc_Ab}Sls@f}[_b@vq[spClmf@wcKtsb@imKd`^}fFlmb@apCfc@dn@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PIJJLKJJKOJHP", 
      "numLevels": 18, 
      "points": "graeDxmjqQsnMqSeo]u|F}kZu}OixLn}@|vFkwIesQuoEwgSapQqp@xjFmeAsrJzaq@lf`@huw@fmYzhMt}B", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PJJIFNJKP", 
      "numLevels": 18, 
      "points": "wv|hDt`joQ_jMi|CiuLatMaeBrrCwxGqmEeuOceLxwDuyEtfIjeBxug@vfe@", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PKJJJNKP", 
      "numLevels": 18, 
      "points": "iwhjD`a`nQotSm_E_fAwtK}hYkkg@kn@{nLayKa|F~{GcyCzqu@rhtA", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PJJNP", 
      "numLevels": 18, 
      "points": "m`rpDbincQyj^}nd@mqOyo[lnCsuBxmj@jvdA", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PJJILJIJJLJJJJJJKJJKKJJOJJIKJJLKJKKJMJJKKJJJJLIIJKJJJJKMJJJKKKKJKJOJJKJJKIJKJJKLJLJJJJNJJKJMKKJPJJJKKJJKIKJJJMJKJIKJJJKJNJJJIILJJJJKKKGPHIHIJME@EFHEFDPGHFFCGFIEGGCEPEGGEGEFFPGDGGEFGMHHKHHHIOJHIKIHIKHILIIIKHIHLHHIJGIHKIIHKEIIILHGIIKGHJFMIJKHIKJHIIJHMHHKHIHHLJIKGIFJGJLJIIJHKHILIJHHKIMGKHJJHKHHKIJIHMIHHKHHJLHJHKKIKHJHJJHIMHHKIHKHJHJHKHIHIIJHIHJHLGJHIKEHJJHIHKIIJGHJIIIJLJGJIIJHNFJHIHJHJJHHJHHJHIIIHIHJHIHKHJJIIJGHGJIGKGHIIIHJHHJGJHHJGJJHHGKHJGHJHHJHJLIIIJHIKIJIIJJHJHPFEHEGDMIFHIGIIJHHFILIIHIGKHHHIIKHGJGHHKIGKIIHHHGJIIKHKHHHGJIIIKHIKHHIIHJGGKHHIINHGKHHJHHIJHIIHJEIHHKIHJIHHJIIJHIJHJHLIHHIHHJHIHHKHIKGJHHIJHHHHILJKILPKBCJNJKJJNJGJLKJMJLIOIKKKLJJJJJNKKKJLJJNIKJIKKMNJMLJKLMJKKILIJJMJJJLMJKKIJLDNKJJKJLJLKJKNLJIIMJJIKKJGIMDLKJJLJLJJJJMJJHIMKGMIJKJJIIPFJKJLJJJLJJMJMKLJLLLMKNJKKMJGKKJJKKKJMKJJJP", 
      "numLevels": 18, 
      "points": "s}v|CheuqQgePll]yaCw}A_p@llF__K`zEidFtzi@rC~u`@xyCvaFoaE|i@v_Af}UajGjyPimCu_CqiAvaChcCz}E}dHhwBpOjhFqtKlmLbxBpzEcoJpwT|qBdfNk~X~uZd{ArkPsyEz|DkvCpu_@}lLy_@weJ`cLotE{Paeu@dkV_mPfoSupHvLymErdK_i`@}nByxLtnDsoHnhNsr`@{jIqsAraFedThkCypHdh_@{cVvwR}lBvoJm}c@pbLofBr`Ium\\rfSyhHd{U_vFty@_rFhpMcyFk^ilMvmJ{nOn|CoiCq`EenGxkMq{GeeBk|LboQwpl@f}PwnD|eJux]veCs{O~nRoyMhpDepXnlh@yqRjkJuiI~{d@g~Rui@~iHrrI_~LeRq\\zeKsfPbiH_xCs{Afy@teHsnDvhCn_DdgLkeH`b@`xGriFbr@rjJu{DliVvk@f_HitExuAd_D`pSg|DzqHxtEtuPctQdzq@txEdmGhbNvjBklBjbVv_FjpHwrDlxC|}G||JgiAdqF|xh@haXjbVflBllJ`{J~lOd}C`zFmfGrmF~xV`mh@rh_@{rD`bUvbC~tAwnKzwI|pBnxFcyFlgRupM`eI{qG~{d@ewFbyBnBlgGs`I_yAnvAdwBm{Jpoq@ydMdeVugOd{F__Llw`@idXhx]{aXngGkxR`|Qc|[fiCy{P{fCqnPbmDyzT|vTmaDym@waBxaHkya@pjFgyLpxQykGfaAaU~hKkgWb`]dyA~pGiuEvvDn_BvbDqcFh}M}sHftBquQhk[{ePfpHenOro_@}pj@~sk@}mO|zh@u|p@jg`@ufIrm]adEtvMcgDbFmzHtmDcuBs_AejJaFuq@blBw`CgdDbAw{n@uDughAaPybrE~Eg|L{XqmaDrGalFg@oep@bKuolAbMgpt@ifOmPeasAlZaqtAyaAczqA}e@evc@gZazq@ga@ga}AoUomtAyj@qzi@fO_oh@rD{dvAcWwdV~@{g|@~GaatAfS{CyyDjLgmaDeP}qX~DyyoAxWssfB{Hu|X^}qnAuZa~hBlGub@n}sAaX~|`@rBbwr@bM~|d@ib@zin@vPzo\\aFxlv@pPlbc@kPxA_uCumB_jDzAeoAh`Eu_ItwDe|BhhBo~DbhJqeI|~K}bQnv@qhO{dBkdBkuCcm@af@}tCjdAibIl_CylCptBu_GmZspDykDwaBqhEoGocCuqDfiFu~FdyAw}I|zDwpAlaFynHxfDmx@htHzr@jfEgwAxcAqxAjeAilHaj@otH~y@_mGaaA}rFf|AapG|qEi}J~{AwtNhvAkjEvFuhMmwBgoCnQc_CgfAi~E~j@etBdz@c`EtcFgtBfrF{iJdjA{_IqfAyfD{fBywA{\\cdBkqD{h@scDqrEzO}yDlfBynGxm@_jSaoC{_FaaAqhCfyAq`CnsKnfBfrKaxC|_Bq~DpPkgEkxAa~Fh{DyiEhfAoNjdAf~AxcB}kAz~B`~Cvz@p@xuBifCbz@m|GduBwtFgKqjBsoEsdKgcGmrE_l@}iDohEwyCuiBonExvBazLfaI}o@|~AggBuGwbCkoAmbFtw@e}Ff`@g{AtiAsb@zqIcZ|_BiiGo_AocHa`EoeC}s@wfDc~CmDlpCidGnuAks@_xAqqA{cC_\\qfAaxEng@grCh`FmrC|~ArZvgAbdDdfBbrA~`LwvBruCidFbPueF{b@s{CcbA}j@gvKdYgbBejFuxAjoDcrApWcb@oeA`dBczGg}@mzB}`DmpBqfL^|i@}yBw`A}fEavAoh@lhAmaE|}Cq`Bt|FkWnjCaoBxUiiBytAyyDhJifBzmFyoHiLegFwvAiqBs_J_aBsx@ufAvkB}}NxnElxDr{B_pArlBcsFx{@gaInkDm|@f}@qrAw~@qgLnjH_oH~xEcpCfVwbEokAw_BijHmdAsfAqgAlgBqxK{Jq~CibAwpBmsD{m@aiCk{BuU|pA|_BvbD_m@~MmqA_vAih@o}Btf@avFw~A_oBpSeoGc{AscCxhAgnA{nAwkAoeBdDkKss@xkBahBgk@msByzCaaBoBo}@htHw{OmKu_CgfCq}D|qAqgDqkDsYgyAeUg}@ouArt@weH_}Cy|K[e_CyeBpJcp@yu@`t@smGdgEyeBiOcfDdv@tk@`\\v`Cjm@sT}iAuaEbcBuvAm\\a_Ed`CgfBi_@wvVubDte@p`AguEw@_`B_aEyw@z|BytAcl@{mAmcEx@spDwjBfdCyvOxOe~BdsCaGj]sm@az@ctCnSypAreCnm@xs@ee@kuDy|B~aCcAnkAu}BnoBma@{TsxC~tA{qCu}@q_CjpB_v@hl@c|Bj{CdBmAoiCnnAs{@vuAj`@lzAqhEh_DmsCQaqFl|@qbBqtAgzBrAywBbaApnBxt@`FaRsoEl{BzoAaMw_CleAflAtg@coArcAu{Haf@{kCnYapAnzAsdAte@prCv`@fHnMacAwf@szBeuA}j@hqBk_EsrA_bBdt@gh@_HenBrv@`[nDt{Bvh@bSpSmiAcz@caEprAwTz`@p}Bpl@ExPwiAo_AghElhCdk@e|@syAno@e}@wv@yuC}Zq|FlyBrAbmA`~A`p@ir@_C{{AzrC{gCgHgqAyqBkxAnSat@tkBnIflAlnCzmAcxCc~CoeGfdB{cDgnCgUgz@_{Bp\\aj@|mChNy~DchF|h@wwAdvC~kAbU_xCihDsa@ku@o}GxeDaZ}c@_`JocAgjAbi@u|CbdCk~Czwv@pB~fo@~LzoZxP~rc@wGxtz@_^bad@{Av_g@z@t`@k|C|dAia@reE}hDtnCel@ttAauEo@inB|iBra@uJgvClwCci@mGieAbdCcWflEumAj~Aq}DbjDskAldCxw@hnCkcCnoB`^|\\se@{VcfBbeFhyB|`C{`@fc@|r@vyDh]dQ|bBd{CmQvpA{dBxoBic@h}C}|DxQchBwj@oaB~aBibBdGs`Df|ClqAh]pcEr^`DraD{wCkKipD`~A|Tvq@i|A|_A`x@zhAoId|@mj@vo@wqCbaDkQ_H}bD~zGtfGbaBj[paDa~CkUy`AbeBi{AyJwxA`c@w[`mDmD`mA{~Bj~DjlAztBcw@lq@eiBmtBwcDd_@mfCbo@mKzI~}@vrAiu@pVdbB`fDyh@tg@yy@p|@tj@`i@~eC`v@rSbc@mhBllAdE`o@mhDpmBtu@|oByrBxyClxFoWjnBb_@jQx`BnQza@y|@|_BzfAnd@usC`rAyeA_Wc_@tzCch@hv@fZ~KvyBfyBkRfTfoBbaBbXvxAyn@lgAiq@p}AhtApPobAlvA_^lcD|aEryDpS|cD`oEbuAqbAkBl~@ziCu`@`rCn_@`vA|gGhnEjoBeAd|AzfB{r@tn@tq@foB_cCgEngCrfAlwCbwBNnlC|kBplCqyD|mBhx@lv@am@rn@ln@bsBqhB`n@`a@f{Bwi@h{@~zC~uCjbC~gDllAxxAok@zqA|fA`rA_@t_FyvD`n@a~DpiJ|q@dvBxm@nuFo`Al_@ir@jzC|TbOgfBpj@rPDdnArpCuI|RpfAbvBxm@vzEcT|sIdiHt~Ax}QxaD}D|p[nsQva[ayU`Bh_l@phUp}w@np@~{BbgVntz@tmLflOiwBzsBc}P{dSaiJuiT~_Bi}LitFycErgAj_Gcv@`nCk{Cb_Ev{Fztj@wlVm}NiwQme@aoFp|E~mErhQvyP|gJmtAzzGaxV~k]n`QcjHffEe~HvoV|yCfoJqbSxwFz~L}XcsFt{Ftu@vXesFelDfUfnHs`DjpDuxMenCvzMtrOxl@gjBbfIvkXfoU}XnkQpbOrY|kAnjEvwWb~Hpea@tiu@t{Mzp]s_DehAfuAzmUrmHpn\\pfLvtB}xQorp@d`l@voaBcbTk~h@oaJkp@f~Npqp@e`D~GewAy|NsrCteOy}WumPryM||Jd{CflMgfHk`B~rMp{ItcBnlFueIrkDu{I|DvvAvuEalGdlCfhJ{kB}iCksDbxNd_BnqDenGdkIxrUgyFypImoJtjBvhJnsDi~@zqDoaG]brAtmJkzIZevUlIh}UtYseDx|A`S|vIbzEfsAlyIalIlsKtUu}AwoGdgLwsNrcFx}M`v@kvGmpFoeGvwKawOr}Wbzs@asEr_Ga{I`Hgn@~eF{mMn`HdmD|dFbTc}E`|EwuDlwBtdBurAfgNjgI{vKpvFeKhbGbk@peGi_BznB``Dx}Q`w[cyZumFt~GdfKztC}tEf_MtsEujCtlJ}dKw}@npLtcTacEhUtMtjEdlGkcAxaIbdSncBavB~lCrtDgzA_tE{tAabUimIe{Q~aPgOfnSpvPxcShxNe~@daI}u@oqEeyFjuL|aExcNsnEk_Bj}BxbYukChkB`iAh{Ch~BqiCrnCezBwdAoyPtyJbq@hmJikNmRheEhyCmwDlvHnoErn@n}GzIebIo|MinFzuBkrJruWl}Nbcn@~wNlG`fPajVlk@hqQhaCxqGf_M_jVfh\\`nW{tLph@rmSlfJuem@eyE}rVhzb@v{MlrOcxCrsBxnPtvXu`AteIqeK|sd@eqGfdOq`DxaGlpHl|PqmIpaDagIvna@{~AhhUqqRt{K~oCmi@cjKtsIo~F}`AhjYjdD}ObfCp}M|~L~[`@loH", 
      "zoomFactor": 2
    }
  ]
},
"US-UT": {
  "center": {
    "lat": 39.497012, 
    "lng": -111.54524
  }, 
  "code": "US-UT", 
  "name": "Utah", 
  "polylines": [
    {
      "levels": "PCCFEGDPGGHFNFDODDPGGDFFEHIFEPEIHEFGFFOFP", 
      "numLevels": 18, 
      "points": "ewwgFlzawTatsAsLmaTcD_|fD_YahgAs@eof@{IqdlDHszaEtD}b@k~kE`LipcDiSgbHhLcjuBxWwavA`qpAxM`p}@rBncr@}BcG_}_Ex@i|JgDqhyDba`AoLjywAz^``kB`GbeZbEnu]eLlehDxNzwo@|Jz}PmlAnzr@s@vbq@|MrzzB`Qp[rgxD~@x{wAckA`fE~Gz~p@zCpiwBze@xakDuN|rz@`JbydA{@vl~EeqtBxSyhhB?", 
      "zoomFactor": 2
    }
  ]
},
"US-VA": {
  "center": {
    "lat": 37.9993025, 
    "lng": -79.458698
  }, 
  "code": "US-VA", 
  "name": "Virginia", 
  "polylines": [
    {
      "levels": "PLJJKJKJKJJJJKIMJHJOJJKKKKKJJKJKJP", 
      "numLevels": 18, 
      "points": "wfraFn_unM{sb@zgHaja@glO~_@v`EohGcbAazEutCj\\ckKqy@vkMawCagApa@igG{hA~sBqjVewSwfN_jBywEw{OaqEsy@wcMnfHkaAcwMysD}~@kcDegCy}Bipp@jl}@b{n@p{BanD~bPzkT|xDsrHzHxaNvhHdtDriBg_ItwCn`TvjGrm@bpBwxDw}@l_Ff|HfwLp|j@duErdBnvF", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PIJIIMHJP", 
      "numLevels": 18, 
      "points": "ordfFxwbkMccD_aGxD~qEinBgfE_gTyyMyDynDfyKr~IbnM`{F`qAddH", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PGFGGEEHFJEGIJI?JIFDICDFHHIEPHJHIHIGLIIKHIKIKHKHIHKIEHKBNJHHKJLHIHJHHJHHMKHIGJHKHLIIIGIGKIJLIIHKHHGIGKJHHJOHHIKJHJKHKHJHHLIIIIIHJIHGJHHIHIKHJHHJJKIIJIIMJKJNIJHJIHJHLLHIHKIJIHJKIHJGDILHJIHIJJHJIPHEFMHHHILHHLHHKHIILHHJGJJJJINHJGHHHLHIEIJJJLEKJNJLHKLJHKIKJOKJJJMKJIJNIIKMJMIKMJKILJJKJKMJNGJJKJJKKKKNHLJJJJKJKJKJKLJNJJKMHKKJJLJJJJMJHLJGLILJLIKIMPJJMLIKKDDCCFFFDAHDP", 
      "numLevels": 18, 
      "points": "a``~Ex|z}Mu[dlu@zNtqJwNv{bAgVreMfLxgx@m@tmg@zPh{z@eLhuCkWbsjA_f@nia@qp@lbx@yn@vhuAygBnl~@}nBwlBoWzna@qKtmPhmBxcA~Cp|j@vEneKdMdtNr@li|@bBptm@o@nvY|Rnxj@oJ`iFy`AneDdIj}c@Xneh@eqBipDeuGmsUeAsxLq`Ao}IibBiqBgdC}qKqyC{~Uec@cvKmdAewA}mDzV_`MswJwo@gdC_`@}uQaxDweMmoFykBehG`d@y`EurImpDyhPsfEeUwz@_cAemBfkAuhBgMikOgo\\ea@koBw_I}c[i|@gdIetGqtKmek@ui_AhxCuuCbtAhmAd~@tpD~dBthAf~HudLtpG`e@paEmxDr}AkoEdrBa_@neCuzBhd@}qCsn@amCd|Aa~F|fCurAb}AqdFv}D__F_HuiTanDo~HqrBm}@wHc}BioDeaMiqDmlAwlD_hExyGedHhmI{jP}wEw`OsdAyrUc}BurF`|@em@f\\saAyz@sqEwlFgkNcgAyj@}jFzsDgxEwfD~_Ae}HbdCgAta@uuDl{A}j@}n@q~Aau@qGc^sfB`ZkxCmgJg`TuoCauIoc@msEhyAoaC`fDyE`dAgjAsjAqsHq_EwfFy_A}`Fg}Aa\\{{BmsJ{{C{k@fp@fkDk^`mBgoEmx@u{DovL_jDujDweBx|E^vaHchApWkwBix@ydAhm@cnGujIyaE`\\efCktE}qC~Ry|F_eIojB|BqiBikA{vAkbGaqCcjAe_G_bI{tEmrIwoHqsEsrDaw@s_FuuDooB|j@caGa{CcgBjc@yzLirO}qBsiFyeBkk@_uArdBq_BkN}vF_bFnLwaEyjG_oAe}Eu_FguLpt@u~B_hDsvDxVufG{gD|oFytSz{PsxHltHka`@eyC_vG}lGi}F}ua@ojSoa@yf@l[ejEkkHeGkuIw~DsqD_Jiy@qbCocHi`H`hOqrVuvL{{HmaHsmCmbEwpGgnB}fAoE}sAj}Ci_@igBeqFosD{nEguDwcBplA}gEmbHk{Gwz@_XygAr|AmhCakDmcFazEcqBeeBik@}gF}wDykBghCeoD_hDpfCwyAgEalEstCsmA`yAokOkeMkz@hRabAreCsvBg~Aa{MyOrpEqxLdiEagHdoWeie@`aYoqf@sz@oaA_vIizAewHogFamF}u@enE}fEcE_lHnuBciKfGihH`wDifD|uBwkHjaC_uDb`AmQrcG|fBxxBllFz}FiUjnAgrEnoCcyBzvAueDyIu{O~c@ahCxyE{kL`bIokAldAa|PlkE{vDzeBcpGlwDadAzrCcsDbuChGnw@|\\r_Bc}@d`Dt~@jpLpEfi@laAiSvyCneAleAtbDxfElxDl]|}ClcL{lFqNv}@dlE~`\\dzMxuK|xElnMiqHxsBbiEvmAazNwqGojc@dqQ{wIfeNchK~`OoqaAf_HabHxoHhw@niCx`Byz@erHt{I_s]haLmeT`xFml@~_IxdMbqNezAruBbeHnjCcsE~uIfgCcpE|t^yeUpiM_cDv_I}nVnjZwPpbHlsVoyOfsCk{Hh}Xm|T|uP{wp@xaDlsEkjDja_@phFujNoBwiNxoWwvRbuJv_CoYb`DsoJvlFqqK`aTdsFviBdi@ycHlsFirA{ZtbIjlOqgKnlFnjLyr]fqd@kf@|~HvcH{wEduNksM~kO{g`@dvI{gA}_CwcBdeDymEc~DqdDfvIuaIzxApnTpoEyxUpoIbyA|zD`yPf|CzbG}~RdoSq`CabBwvDrrH`jFvWudI|_Jk`H}{AifHxlFyh@tqHpsFxpHwdHnvH}Tx}J_mNnqB|kKjQtmC`iKd}E{|Fcf@ueS~`JciLwfHimGdyHcyAzgQ}c@fxD{cPhxDd}E}eAqkJ|tGsxKrtH|kDcj@wyE~qCvZ`oI|lMr_HjGqlMstIufEqyQoiAsfKdkI}e@rvC`eId|@lk@czBojOjlBqyCkeUf|As`CgqC|kD{~Nj~DsaAwhDwhM~s@e`WhvfAq{UaAzsCsjGax@{|VdiJte_@fjHM`qD}cHxwEnbHkbBi@~{N|E|rf@n@tt_@nBt{K|EpleAkLrmp@xMzzZ~AhuuAbBjjYzA`z\\lj@~ss@hXrzY", 
      "zoomFactor": 2
    }
  ]
},
"US-VT": {
  "center": {
    "lat": 43.869591, 
    "lng": -72.470685
  }, 
  "code": "US-VT", 
  "name": "Vermont", 
  "polylines": [
    {
      "levels": "PHJIGFLIIIKHJKILHKHIJIHIHKHHHJKJHLIFIKHHIJJIKJHPFFGPJHKIILIHHHKJHIMHHIHIGIHJHHIMIIJGIIJHGHJHLHIJHJHHJJMIIHIIHJHIIHIKHGJHLIHIHINDDP", 
      "numLevels": 18, 
      "points": "wy{cG|ec~L{G`eAm}I`gDwpEufB}cSiU_kgAaaDkmf@ahA}aH|eCy`BjcEmpBk{@mdDflAs^~y@v{@|vJp}GtwCkrAx{DeuH~[q`OycIegGoxAugCnM_bDz_De|Nc{@gsDz{DuiMljAqzDex@ujDllDypB}C}iGmdDcxDoDg_Fg`DcuDq\\coJ_aMi}SxwCkmFgyDwiDuh@uwTd`Gi{@lrAm|CxqC_}Fv`A{yA_hAigDlQkvBk|AcqGt|ActMy`H{zBfgGcsDxqAcpOy}GssHrxA_vCud@uMco]lRgg|BgKo`}Bsd@cmlA|dFf}EllEutCbrGkaAziOtlLbeFls@fiFvhH`nKsqCliDiuBdqAq`Cj~F}uAjmBgkBflD|yIblAiDppAgdBnbE`fAd|BrkD{LljCdn@vdAntDju@ltB|~BjoCpoP|vAvaEhrEtqCne@btArq@rgQp_A~`AaJ~yItnDp_GdlFnuCjhDy}AjeI~{Ax_D_zA`~Eg|@x}BfzAdZwiBpnAhMz_ItfGloCvr@bzBlyClnAbQxrB{bCttBjeCbzDts@j|DxmHtaNd{ApfFxcCbvAnpAf_Bx~FxdFzqGfwRptDd{Cr{FruIheCxlE_mAlpMxtAlmEhbBfbDsyApkDtmAbcBwo@ntMhnEn{M~gBjwFk{AvgFrc@hjEfqBddHy[pqCddB~`Ah`E|uAtbBbsFt[xcI|qDtiIwyAlrBs`Dh_Ccc@tk@wmDd{AejBdbC_g@_gAdgzA}Qh{Qkb@zpm@", 
      "zoomFactor": 2
    }
  ]
},
"US-WA": {
  "center": {
    "lat": 47.271496, 
    "lng": -120.825953
  }, 
  "code": "US-WA", 
  "name": "Washington", 
  "polylines": [
    {
      "levels": "PJKKIJMFNKJMJLKKJLJP", 
      "numLevels": 18, 
      "points": "ijkcHnu~iVmsA|{IcqLdsD|{BjiMknK|lK_g\\h~OejFrhMmhJm}E{mVkeLaq@s}JljOmjNriF`QioAzoQjzLfeTjvB}sVbhXosKsjBmwH`bKkuUriLuxCzqJfdE", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PILIMGIIKKIP", 
      "numLevels": 18, 
      "points": "qttfHzdpmVw}EjzWchG~qKo}Fr~@w|JisDl~AihF`}Hu{PpsCeTji@o}FzsAhrIlsCeTj}Gc}H", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PIIGIHMHIIDIILHKHMHJHIKKJJKKOLJLMKKLJMJILHMJJLKNJJLMJJKGLJKLJPJLKKJKJOKJMJJJLKIJOJMJMJKKJJNKLLJJJNJJKLJJJLLGLKJMKJMJMKJPKJLKJKKJKHMJIJLJKJNJLKKLMJKJMKKMJJLKMJIKKJKKP@PGGFBHFGJHLIJIIKIKIPFDFGMHKGIGGIKHJHGJHILHKIIKGHIJHHJIILHHJHKHIEJIGLIIHHJHP", 
      "numLevels": 18, 
      "points": "gc~tGviniVgoC`lItGlwNuzDt`XajAbwOkvC~xGuqBjpKihN~iAolEsr@swFfsCcxHyT_lByAeaFniCywFnHsgO|eL{dIbwCwaEbpMyyGr|MirCtgLyYhgJzsAlaFlaDhbFmCn|IimXxl_@heBbd\\ifDtqSdxG|h^osLf_TxkGbwO_wgA_tAf~IkhGd`f@y}@e`Ceo`@y~MfkRizDqeHkvS|oK_|IebEsyGmuO{eDbtI`uDny[iqAjjHyxJzcAsqTvdFar@smEnsEmEzyHqyMykKfpBk~Mgwl@slAbxb@stIvoFugAjfNraUjuHsjm@z~DqbTzpFonM~dPmua@hxDczThxCib`@dqTgxKn}Vs}t@`sWo_OgkDwl[viAt}Bc_]fue@axnBzkHwasBujFgmt@|sIekf@djDhSs}KijO{bAmbMvmJxsE~y_@qrZphI{p@lyIx_Qhg@pqGysIfzB|xD~rHnf]n|F`bLbhOpc\\zrXf`TzyF_[k`[_uOura@`bOnsf@_`B||Mge[szOugRqjT__Hc`_@kxQyyD{dQkzTsyOzK`fDi{Nld]ikJpiJl{[bqW_zE}kA_bExzJqmA~_B_nFhgTlpIvwCoxA~xFxrGd{HkzErfE`jDoeGx`ErmC{[meCdcQmxSwzLChu@~cJtiSruM~nD|kG}vH|yJ~aGacMdnK{_SqbIaqChsDj_KrgNhyPb|l@``V}tE_bAqvH`iIgcTyeN{~XhnGsaKgbBunD{}NucTe~Sq|JcsD|aB`bJs|VaqBgbEiqCtoHwmBw`Cg~CusQe}Ggb@ymVtfMgsOc`A{lLvjEmnTa~Bgka@i{PauB_fMqnFaqAmqV|p\\w}QnqEsRd{JdoRus@ljLwdQulMh|\\a}MhkDymG}lE`l@omSqlGabDiiWvic@lGv`S}{NjiEcxCeyPrxJ_rOuVusHy~QrcEuxFoxM{sFbkJehMfqFu_Hu{@{xGlgb@s{SfbJq}FbiLy^oiNqqGjcC_@o||VCgy`Jpr^iQjtyC~{@htMuGfavB~YlbStBzdZ{G~xpB|DxeTaThuF~c@dxFdzB~qAiaFbmEocDbkIwsDlbIw_@lgE{lFjiLhhEdtBx~CdoAgwDtwLepFc\\xzlBuAftVlA`eiA_Jp|@bO`h`EzkE~wHp|FdbT|SroFk_AbfW~|Af~M|SjrJb}AliMewAv`NzuAblE~cH`_JfcAlh]~|@baFn_CriWh`EnoMjuBl`PfbG`aI~Rf{MriDje^sf@p{IazGhzL{OnnIxcAnwEbiCdpFfzGtb_@txDvaHw{A||Ff_@l{Bao@huK~e@fyFdvF~aIzg@|qHqnAzmBirGheAes@ncAinAfcKmqBnoGaR|iHzw@xqIiZh_CwxCp{Oj_Epsa@yDteIqcAdfI|sCvaNtxEzoFbf@p}GboBziDviDt_O|gG~x^j^~jJ", 
      "zoomFactor": 2
    }
  ]
},
"US-WI": {
  "center": {
    "lat": 44.7208065, 
    "lng": -89.926555
  }, 
  "code": "US-WI", 
  "name": "Wisconsin", 
  "polylines": [
    {
      "levels": "PJKLJKKKHNKJKKKKJJJJJJP", 
      "numLevels": 18, 
      "points": "ewlpGp}{sOsrFpeLcjMveD_iSijK{hFwmJg|VqgIp|BijIisZazTzd@adEqr@wlHxkJ{rBvgCdnDk~DpsH`jR}yBtOdsIvbIqyEvSljGbrFuVwfAbrDd_Oh|KhtH{|@pvJleFlpMdrS", 
      "zoomFactor": 2
    }, 
    {
      "levels": "PFFFEHEEGBDMIHHLHEJHPHJIGHLJILIHLHJIIHIGKGNHJGJGHKHIIGKIHKHHKIKIHOIEIHJHIKJIIGKIHJMHIKHHKMIGJIHLHIJJJHJIMCDPKKJKINJLNKIJJLHIHHKHHHLDKFFIHHIHHIKIIHHJHHHIIGIIHLHEJIKHKLHJIIHPHJHHJHKJJHKIJJMHHIIIJJLHHHHHLIIJNJKHLJKIJKJOIKJJGKJJLINIKJKKKKJIMJJLJJKIP", 
      "numLevels": 18, 
      "points": "ctibGt|zvO}AvrlAwM~cSlM~xnAwFblJDj_a@}j@hbqApAp_Gid@hxsAaC~jPmYn}_BiEvsi@_wBunAuhDlsA}`Bf|C{~K`}DevBr|HwcCju[iNzfDycDpqNskFtaLgoF`bBoePhfAisIp|GmvMzpAerN`n@sIbv@isKal@opT}_QmmCkO{jEljA_}F|fRqfBlcCsmIfnA}|Fb{Cw`FalAmjHdiBqxHgn@eiNt}CwxGhBoyKyo@opJf~F}oRv{NeoFlgIwnHv_SsCr}Fsc@zjE_bDjzHqvLbvRgpI`tQm}KpxFy_EnqEiuDlA}eCvcBu}ClpEi~HnfVqmCnlUknBnkGy_FlhH{lHtsCelAl~BqjCd{_@ozEjnRiiEvdCizLlzSsjEtjLolPmuG}fDfS}gFnn@{_BcoBa`CaYowKpkB{bCyXynG~qEegH{_IknGaBu{DhmB_`Dwk@wsOev@u_CatFowGskCmiEw`F}qGuVoaBp|@w{Af~DmaNbjGkiBrsEjDjfMm_BddGg|Kpt@ayKs}Ca~B}cDwiEysIgmMs|Dao@szAi~GcmDsyCeyFk}EsdUsbEkrDpGc`KysGmhFxx@evJuf@ctBguE{tBeeBmlFchOuAatq@u@qln@yGliAggNmuQkbUrnJy|P|U{cOo~MqlfAuee@ypfCphEg`P~fFnQbcy@`a\\gwJaee@pjJqad@fuBe|X|sDulCmiA{_Mjl@weAhwByL`O_}DrtAcfArN}cHlnKkxH~mHkyBrrDoeDpyC{TnbF{lc@z|]ge`DxyGujUlfDsvJlcH_rVuz@caAlVceBtfA{Zus@ibHpaAomCsF}bDffDuqEqCaoDwdCgoB`h@siCu_AwgDhCukEhb@qeCfuAc_AaIkwDlkBq|H{dAypEhmDynHv\\qiC}^meGvvBsfGcb@oxErjB}xDn}@asFlb@qlBdsD|JlpBu|DhqFh_Jt_B~q@dmDq`G|`@{fF{v@w_KvqDqaCjaBgtQvoDmbE|cAa~F|}@mAtjBasCbr@vTx`At`FhcA~Px`GiqG`oAcEdfEfeAMhgGluCqqCb{GqaBvjEnvCpdCnbHrrFabArzF~sEpVg{@m}@}`@~Jgg@`uCcaCakA{qAx`@}gLynFewLzvD}}GntAlIxyMlpJ~{CfCl_AvyAz{CfKvmA`zAlkCwg@p_FkbJrdEop@byAsiOlkFvgF`tKjJz|Dj`XhuElzPjpIaw@lz\\jf]`mGiOlmFb{DrmGsiFcdD|gFl|HfjDr_FunMuUywFaeNggJshDmlSwyGq{Foa[ojTiqBm`K|oD}EmhLa`V`pNi}KfhBgjIh_VhmJp|ZzrR`gg@vnKru\\a}B`fN`yWpyf@|}Nnbj@eqC~wWvgOjbPthBxpRhcMno^tyAluVayDdxHlfEh}JezI|_WqfBboKciKbtT|wEhta@vc@", 
      "zoomFactor": 2
    }
  ]
},
"US-WV": {
  "center": {
    "lat": 38.921044, 
    "lng": -80.187308
  }, 
  "code": "US-WV", 
  "name": "West Virginia", 
  "polylines": [
    {
      "levels": "PHLJJNIIJIIKJJHHJHKIHIHHJGHIJHIIIIILHHJHKHKJHJKIHHNJHHJKGIGHHKHIILJIKGIGIIILHLHJGIHOJHHJHHLHIHJIKHHJLIIJIIKHHJIKJILIHJJHJKGGJIIPIHJJGKHIILGHIHGKHKIHLIHILHJJEHHMIIGKJJELIHKIMIJHLHHKIJHIMHKJHKGIKHIKHHHHHHHJGHNGIJHHKIIHJHKGHJHIHGJGHHLIJFKHIHLIHIPEEGBDNFCFNOHHHIIFIJIIIHLHHJKHHIJJHIMIGJHJJHHKGHHHGLHHKJIKKIHHJKHHIHLJCKIJHHIIHIHKJGGJIKJGHJJHPIIIHKHIJHHHJHKIHHHNFEHMIJHJJIHIJHLIDGJHIKJHIJIKHIHLLHJHIJHJP", 
      "numLevels": 18, 
      "points": "_vziF||qbN|lGh}FdyC~uGmtHja`@{{PrxH}oFxtStfGzgDrvDyVt~B~gDfuLqt@d}Et_FxjG~nAoLvaE|vF~aFp_BjN~tAsdBxeBjk@|qBriFxzLhrObgBkc@baG`{CnoB}j@r_FtuDrrD`w@voHpsEztElrId_G~aI`qCbjAzvAjbGpiBhkAnjB}Bx|F~dI|qC_SdfCjtExaEa\\bnGtjIxdAim@jwBhx@bhAqW_@waHveBy|E~iDtjDt{DnvLfoElx@j^amBgp@gkDz{Czk@z{BlsJf}A`\\x_A|`Fp_EvfFrjApsHadAfjAafDxEiyAnaCnc@lsEtoC`uIlgJf`TaZjxCb^rfB`u@pG|n@p~Am{A|j@ua@tuDcdCfA_`Ad}HfxEvfD|jF{sDbgAxj@vlFfkNxz@rqEg\\raAa|@dm@b}BtrFrdAxrU|wEv`OimIzjPyyGddHvlD~gEhqDllAhoDdaMvHb}BprBl}@`nDn~H~GtiTw}D~~Ec}ApdF}fCtrAe|A`~Frn@`mCid@|qCoeCtzBerB`_@s}AjoEqaElxDupGae@g~HtdL_eBuhAe~@upDctAimAixCtuCmjAfiBpnAbvH{aClmCdbDxg@onCnrDcx@fjJ}s@`X}Wow@}_Cqb@}Q`kDkeH~bD`gBf{BwkExlEwkAxdJotMdrEaxA{|@iaD`~BwiDh{K_zJbaBskCtcBijDdfKq}Bqi@giAuqAoeCkZkwFppHmlQhkLgbFviImoClEau@woEkaBok@cxG|z@ch@mhDeaAyyAicFba@s~Amo@czJbaDirGwgAzt@{dAdTemDi`@ogImxCqsN|J}|BgsAwxKmpCm|A{lUuvCo{AevBx}@wdJw~@{vDggFeaAq|Gx~AqiEg^_lLzkEo_D_vBstEsaIwyJki@khIemF{{CedBeiAwdDu{Cq`BaFamGbjCaxClJ_iFbj@_}@hdIsuDfiFxnEj_AyfBtcA_lCqkAy`DceIy`DcaAajBrzCm|Fkh@yaCsnFlxB{lHyd@oiDdkFmjCnbAgaAk\\o@qnEclB_lEwaEiv@wvHvwAoiF}~Eci@k|CizFgs@e_AshCr[uoQa`Ls~Am|BugBkqIswMaYsiBf^ivAbxJ}iJwp@ufF}oEuuIwG}`Hg{BgnAcn@_yC{gCkzBkzDwkKgrDytBgaFi{JyfAa]mjF{pHa|C}}HqAc|BogBucEqnFks@eoBey@aoCm~Dm_BcBklB|uC{rCfxAgqHwaIu~Dti@siBejDs`B}n@mjE|cCwcAyYsW{hAxg@imDwp@wx@}_D`YybFavCeeIaCgcVaaFawAkFgaDqjCaaIypDu_Ek|E{xDq~@{aLp\\g_B|{Bwz@uGmaOqaDotChqCexEdr@wtDzzEquAqD_fE}|Dae@e`DpXagFscCqfIb}]rMjxMyCf~m@lN`hZyEnqK{@pim@mApG{qQkJqwbB[c|\\pH_ov@~beBpv@ebBgrDhFmiAodJwqKomCopFys@i}HkyCq_BgqC{yBkwGc~Qy~Bq]cRafDi|DwiDgkB}l@af@fp@DksEs|Aye@pKi`B`zGaiN_hC_}AkwKsoOqiFkkE{TgdEauBbbBuxDutCk_B}@yrAa~CdmBy^eAe{Ez`@wJtnAzb@zk@hiF|zBykAb_@qrDviBoeBnlCwvHuEckBhq@kjA{b@okEhzAazFoXiyIr_@yjDguAg~CczAc}@yEq{CmcEf_GeiA}dAz^mbHmoEhmDjg@ifHchBqj@sEqaCir@gv@riCgsMgmCq~AwkBcqDm_BeIcKspC}sBgdC`vB_iPphIogLhtCabEelAs`Ef}CgwBad@qz@goCrjA_S}v@`iC_|Es[cmAcbBmM~xAulE_S_qA|jEyNnl@vpAhEhhEvf@t\\`kAe~BjbEy]}jB}`Cnf@ks@yU{g@rjB{Ur}@jlCtq@ylCiYgnI`kBrmDxfC}xAgXhvBlkAos@`cApv@`o@cNxk@azGvfCycBhl@qUvmBtuB`pBibAbgCfv@rhAiYjw@mlCdnE|fE`mF|u@dwHngF~uIhzArz@naAaaYnqf@eoWdie@eiE`gHspEpxL`{MxOrvBf~A`bAseCjz@iRnkOjeMrmAayA`lErtCvyAfE~gDqfCfhCdoD|wDxkBhk@|gFbqBdeBlcF`zElhC`kDxgAs|Avz@~WlbHj{GqlA|gEfuDvcBnsDznEhgBdqFk}Ch_@nE|sAfnB|fAlbEvpGlaHrmCtvLz{HahOprVncHh`Hhy@pbCrqD~IjuIv~DjkHdGm[djEna@xf@|ua@njS", 
      "zoomFactor": 2
    }
  ]
},
"US-WY": {
  "center": {
    "lat": 42.9985255, 
    "lng": -107.55257
  }, 
  "code": "US-WY", 
  "name": "Wyoming", 
  "polylines": [
    {
      "levels": "PFCOHDDGGDHFDDPDFDFFDHFCEPHHHFGGDGCEGPEGEDEFFEEP", 
      "numLevels": 18, 
      "points": "wdo}Fb~azRndYvJxka@iHndjAkMvv@llkD{KzfbAkVfrsDoFhpWtPzvgBoIlttAgSh`wBz]hs{EfDphyDy@h|JbG~|_Eocr@|Bap}@sBaqpAyMa`bB_K{{cBfNkvr@wImal@oC}ezAtUiz~AfFyid@Hau_AhJlTuyxBuf@oeF_YuqlAjS{he@bKkidFyNqnfAbAmgfApUsj~HqE}nm@gO_zuD{F_mGjVex~DrrqAmAhtkAzH~_FeGvex@q@necAyHpxCxFl~{AoQlzjABzawB}O~{y@T", 
      "zoomFactor": 2
    }
  ]
}

}; // end of regions
cg.regions = __regions;

return cg;
})();
