/* ═══════════════ THE POUR JOURNAL — articles ═══════════════ */
const ARTICLES = [
{
id:'whisky', no:'01', title:'Whisky', tag:'The water of life',
excerpt:'From Scottish glens to Indian single malts — the story of the world\u2019s most storied spirit.',
body:`
<p>Call it whisky or whiskey, Scotch or bourbon — few drinks carry as much history in a single glass. The word itself comes from the Gaelic <em>uisge beatha</em>, \u201cwater of life,\u201d and for over five centuries, distillers have been perfecting that promise.</p>
<h4>Origin &amp; History</h4>
<p>Distillation reached Scotland and Ireland through monks around the 1400s, and the first written record of Scotch — an order for malt to make <em>aqua vitae</em> — dates to 1494. Irish whiskey and Scotch whisky spent centuries refining their craft while, across the Atlantic, settlers in Kentucky discovered that corn and charred oak barrels made something entirely its own: bourbon.</p>
<p>The newest chapter is being written closer to home. Indian single malts like Amrut and Paul John now win blind tastings against storied Scottish distilleries — proof that great whisky is about craft, not postcode.</p>
<h4>How It Is Made</h4>
<ul>
<li><strong>Mashing</strong> — malted barley (or corn, rye, wheat) is ground and steeped in hot water to release sugars.</li>
<li><strong>Fermentation</strong> — yeast converts those sugars into alcohol over two to four days.</li>
<li><strong>Distillation</strong> — the wash is distilled twice in copper pot stills (Scotch, Irish) or in tall column stills (bourbon, grain whisky).</li>
<li><strong>Maturation</strong> — the spirit sleeps in oak barrels for a minimum of three years — often far longer — drawing colour, vanilla, smoke and spice from the wood.</li>
</ul>
<h4>How To Serve It</h4>
<p>Neat, in a Glencairn or tumbler, at room temperature — that\u2019s the purist\u2019s way. A few drops of water open up the aromas; one large ice cube chills without drowning it. Save the elaborate cocktails for blends and let single malts speak for themselves.</p>
<div class="pair-box"><strong>At our bar:</strong> a pour of single malt with Chicken 65. Peat smoke and curry-leaf fire were made for each other — ask our bartender for the pairing flight.</div>`
},
{
id:'brandy', no:'02', title:'Brandy', tag:'Burnt wine, liquid gold',
excerpt:'Distilled wine aged into silk — Cognac\u2019s legacy and the art of the nightcap.',
body:`
<p>Brandy begins life as wine and ends it as something deeper. The name comes from the Dutch <em>brandewijn</em> — \u201cburnt wine\u201d — coined by 16th-century traders who distilled wine so it would survive long sea voyages, then discovered it tasted better than what they started with.</p>
<h4>Origin &amp; History</h4>
<p>The spiritual home of brandy is Cognac, a small region in southwestern France where strict rules govern everything from grape to glass. Nearby Armagnac is older and rusticker. The grading you see on labels — VS, VSOP, XO — is simply a promise of age: XO must sleep in oak for at least ten years.</p>
<p>India has its own proud brandy tradition, and a well-aged Indian brandy remains one of the great value pours on any shelf — including ours.</p>
<h4>How It Is Made</h4>
<ul>
<li><strong>Distillation</strong> — wine (usually dry and white) is distilled twice in copper pot stills into a clear, fiery spirit called eau-de-vie.</li>
<li><strong>Ageing</strong> — the spirit rests in oak barrels, mellowing and picking up notes of dried fruit, honey, vanilla and spice.</li>
<li><strong>Blending</strong> — a master blender marries barrels of different ages for consistency and character.</li>
</ul>
<h4>How To Serve It</h4>
<p>In a snifter or balloon glass, at room temperature, warmed gently by your palm. No ice, no mixers — brandy is the original nightcap, built for slow sipping and long conversations.</p>
<div class="pair-box"><strong>At our bar:</strong> VSOP with roasted nuts or a chocolate dessert. Warm, nutty, unhurried — the perfect full stop to an evening.</div>`
},
{
id:'beer', no:'03', title:'Beer', tag:'Five thousand years in a glass',
excerpt:'Humanity\u2019s oldest social drink — from Sumerian brewers to the craft revolution.',
body:`
<p>Beer is older than the pyramids. Sumerians were brewing it 5,000 years ago, Egyptians paid workers in it, and medieval monks perfected it behind monastery walls. It has been the drink of celebrations, harvests and ordinary Tuesdays for all of recorded history.</p>
<h4>Origin &amp; History</h4>
<p>The German Reinheitsgebot of 1516 — the beer purity law — is one of the oldest food regulations in the world. The 19th century brought pale lagers, refrigeration and industrial brewing; the 21st brought the rebellion: the craft revolution, with IPAs, stouts, wheat beers and sours brewed in small batches with obsessive care.</p>
<h4>How It Is Made</h4>
<ul>
<li><strong>Malting &amp; mashing</strong> — barley is malted, mashed with hot water to create sweet wort.</li>
<li><strong>Boiling with hops</strong> — hops add bitterness, aroma and balance.</li>
<li><strong>Fermentation</strong> — ale yeasts work warm and fast; lager yeasts work cold and slow. That single choice defines the two great beer families.</li>
<li><strong>Conditioning</strong> — the beer rests, carbonates and clears before it ever meets a glass.</li>
</ul>
<h4>How To Serve It</h4>
<p>Cold — lagers at 3–5\u00b0C, ales a touch warmer. Pour at 45 degrees into a clean glass and let the foam crown form; it protects the aroma. Never freeze the glass — frost kills flavour.</p>
<div class="pair-box"><strong>At our bar:</strong> an ice-cold lager with murukku and masala peanuts. Crunchy, salty, endlessly refillable — Karaikal\u2019s happiest hour.</div>`
},
{
id:'vodka', no:'04', title:'Vodka', tag:'Little water, big character',
excerpt:'The cleanest canvas in spirits — Poland and Russia\u2019s gift to the cocktail world.',
body:`
<p><em>Vodka</em> comes from the Slavic <em>voda</em> — \u201clittle water.\u201d Born in Poland and Russia around the 14th–15th century, it was designed to be pure: a spirit with no colour, minimal aroma and a texture like silk. That neutrality is exactly what made it the backbone of modern cocktails.</p>
<h4>Origin &amp; History</h4>
<p>For centuries vodka was a rough farmhouse spirit. Charcoal filtration in the 1700s changed everything, and brands like Smirnoff carried it west in the 20th century. The cocktail boom did the rest — the Moscow Mule, the Bloody Mary and the Martini\u2019s rebellious cousin all run on vodka.</p>
<h4>How It Is Made</h4>
<ul>
<li><strong>Distillation</strong> — fermented grain (or potato, or grape) is distilled repeatedly — often three to five times — to strip away impurities.</li>
<li><strong>Filtration</strong> — charcoal, quartz or even diamond dust filtration polishes the spirit to near-neutral.</li>
<li><strong>Dilution</strong> — pure water brings it down to bottle strength, usually 40% ABV.</li>
</ul>
<h4>How To Serve It</h4>
<p>Ice cold, straight from the freezer, in small chilled glasses — the Eastern European way. Or as the engine of a great cocktail: two parts vodka, good tonic, lots of ice, a proper garnish.</p>
<div class="pair-box"><strong>At our bar:</strong> chilled vodka with tandoori starters. Clean spirit, fiery marinade — the contrast is the whole point.</div>`
}
];
ARTICLES.push(
{
id:'rum', no:'05', title:'Rum', tag:'Sugar, sea and rebellion',
excerpt:'Born on Caribbean sugar plantations — the spirit of sailors, tiki bars and slow sunsets.',
body:`
<p>Rum is sunshine with a past. Distilled from sugarcane, it was born on 17th-century Caribbean plantations — Barbados claims the first distilleries — and quickly became the currency of sailors, the fuel of tiki culture and the soul of the great tropical cocktails.</p>
<h4>Origin &amp; History</h4>
<p>When sugar barons realised fermented molasses could be distilled, rum was born. The British Navy issued a daily rum ration for over 300 years. Prohibition-era smugglers, Hemingway\u2019s daiquiris in Havana, the tiki craze of mid-century America — rum has lived several lives, and it\u2019s enjoying a serious renaissance right now.</p>
<h4>How It Is Made</h4>
<ul>
<li><strong>Fermentation</strong> — molasses (or fresh cane juice, for agricole-style rum) is fermented with yeast.</li>
<li><strong>Distillation</strong> — pot stills give heavy, funky rums; column stills give lighter, cleaner ones.</li>
<li><strong>Ageing</strong> — tropical heat accelerates maturation, so even a few years in oak gives deep colour and notes of caramel, banana and spice.</li>
</ul>
<h4>How To Serve It</h4>
<p>White rum belongs in cocktails — Mojito, Daiquiri, Pi\u00f1a Colada. Aged dark rum deserves the whisky treatment: neat or on one big rock, where its molasses depth can unfold slowly.</p>
<div class="pair-box"><strong>At our bar:</strong> aged rum with grilled pineapple or something chocolate. Caramel meets caramel — dangerously easy drinking.</div>`
},
{
id:'wine', no:'06', title:'Wine', tag:'Eight thousand vintages',
excerpt:'The oldest crafted drink on earth — from Georgian clay vessels to your glass.',
body:`
<p>Wine is humanity\u2019s oldest crafted drink. Archaeologists found 8,000-year-old winemaking vessels in Georgia; the Romans industrialised it, monks preserved it, and today it is made on every continent except Antarctica.</p>
<h4>Origin &amp; History</h4>
<p>From the ancient qvevri clay pots of the Caucasus to the ch\u00e2teaux of Bordeaux, wine\u2019s story is the story of civilisation trading, feasting and celebrating. The Old World (France, Italy, Spain) prizes tradition and terroir; the New World (including India\u2019s own Nashik valley) prizes bold fruit and innovation. Both belong on your table.</p>
<h4>How It Is Made</h4>
<ul>
<li><strong>Crushing</strong> — grapes are crushed to release their juice.</li>
<li><strong>Fermentation</strong> — yeast converts grape sugars into alcohol. Red wines ferment with their skins (that\u2019s where the colour and tannin come from); whites ferment without.</li>
<li><strong>Ageing</strong> — in steel for freshness, in oak for depth — then bottled to rest.</li>
</ul>
<h4>How To Serve It</h4>
<p>Reds at 16–18\u00b0C (cooler than an Indian afternoon — a brief chill helps), whites at 7–12\u00b0C. Decant young reds for an hour; they\u2019ll thank you. And the glass matters more than the price tag — aroma needs room.</p>
<div class="pair-box"><strong>At our bar:</strong> a full-bodied red with our cheese platter or smoky grilled paneer. Slow tannins, slow evening.</div>`
},
{
id:'tequila', no:'07', title:'Tequila', tag:'The spirit of Jalisco',
excerpt:'Blue agave, volcanic soil and 500 years of Mexican craft in every sip.',
body:`
<p>Tequila can only come from one place: designated regions of Mexico, chiefly Jalisco, from one plant: the blue agave. Long before the Spanish arrived, locals fermented agave sap into <em>pulque</em>; Spanish distillation turned it into something the world would fall for.</p>
<h4>Origin &amp; History</h4>
<p>The town of Tequila gave the spirit its name, and Mexican law (the NOM) now guards it fiercely — true tequila is 100% blue agave from approved regions. Legends like Don Julio built the premium category, proving tequila is a sipping spirit, not just a shot.</p>
<h4>How It Is Made</h4>
<ul>
<li><strong>Harvest</strong> — jimadores cut agave hearts (pi\u00f1as) after 7–10 years of growth.</li>
<li><strong>Roasting</strong> — the pi\u00f1as are slow-roasted, turning starches into sweet, caramelised sugars.</li>
<li><strong>Crushing &amp; fermentation</strong> — the roasted hearts are crushed, the juice fermented.</li>
<li><strong>Distillation &amp; ageing</strong> — double-distilled, then rested: <em>blanco</em> (unaged, bright), <em>reposado</em> (2–12 months, mellow), <em>a\u00f1ejo</em> (1–3 years, deep).</li>
</ul>
<h4>How To Serve It</h4>
<p>Good tequila is sipped neat, like whisky. In cocktails it\u2019s unmatched — the Margarita and the Paloma are classics for a reason. Salt and lime are tradition, not a dare.</p>
<div class="pair-box"><strong>At our bar:</strong> reposado with lime, salt and grilled chicken. Bright agave, sharp citrus, fire off the grill.</div>`
},
{
id:'gin', no:'08', title:'Gin', tag:'Juniper\u2019s grand tour',
excerpt:'From Dutch medicine to the British gin craze to today\u2019s botanical renaissance.',
body:`
<p>Gin started as medicine. The Dutch distilled <em>genever</em> with juniper berries in the 1600s; British soldiers brought the taste home, and 18th-century London fell into the infamous Gin Craze — then, eventually, into refinement.</p>
<h4>Origin &amp; History</h4>
<p>The column still gave us London Dry: crisp, juniper-forward, elegant. Old Tom added a whisper of sweetness for the first Tom Collins. Today\u2019s craft distillers treat gin like perfume — coriander, citrus peel, cardamom, rose, even seaweed — while juniper remains, by law and by soul, the star.</p>
<h4>How It Is Made</h4>
<ul>
<li><strong>Base spirit</strong> — a neutral grain spirit, distilled clean.</li>
<li><strong>Botanicals</strong> — juniper plus a secret recipe of botanicals, steeped or vapour-infused.</li>
<li><strong>Re-distillation</strong> — a final gentle distillation marries spirit and botanicals into gin.</li>
</ul>
<h4>How To Serve It</h4>
<p>The G&amp;T deserves respect: a proper glass, lots of ice, a quality tonic (not too sweet), and a garnish that matches the botanicals — citrus for classic styles, cucumber for floral ones. Or a Martini, stirred, ice-cold, unapologetic.</p>
<div class="pair-box"><strong>At our bar:</strong> a craft G&amp;T built to your taste — tell us your botanicals and we\u2019ll build the garnish around them.</div>`
}
);
