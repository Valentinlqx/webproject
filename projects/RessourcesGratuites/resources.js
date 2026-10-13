// Données de la page. Pour ajouter un site : une entrée dans « resources » (règles dans tests/unit/rg-data.test.mjs),
// puis « npm run icons » si son emoji est nouveau.
const RESOURCES_DATA = {
  "checked": "2026-10-13",
  "families": [
    {"id":"visuels","emoji":"🖼️","fr":"Visuels","en":"Visuals"},
    {"id":"typo","emoji":"🔤","fr":"Typo","en":"Type"},
    {"id":"son","emoji":"🎵","fr":"Son","en":"Sound"},
    {"id":"video","emoji":"🎬","fr":"Vidéo & Motion","en":"Video & Motion"},
    {"id":"3d","emoji":"🧊","fr":"3D & Jeux","en":"3D & Games"},
    {"id":"outils","emoji":"🛠️","fr":"Logiciels & Web","en":"Software & Web"},
    {"id":"apprendre","emoji":"📖","fr":"Apprendre","en":"Learn"}
  ],
  "categories": [
    {"id":"photos","family":"visuels","fr":"Photos","en":"Photos"},
    {"id":"illustrations","family":"visuels","fr":"Illustrations","en":"Illustrations"},
    {"id":"icones","family":"visuels","fr":"Icônes","en":"Icons"},
    {"id":"textures","family":"visuels","fr":"Textures & motifs","en":"Textures & patterns"},
    {"id":"brushes","family":"visuels","fr":"Brushes","en":"Brushes"},
    {"id":"mockups","family":"visuels","fr":"Mockups","en":"Mockups"},
    {"id":"couleurs","family":"visuels","fr":"Couleurs","en":"Colors"},
    {"id":"polices","family":"typo","fr":"Polices","en":"Fonts"},
    {"id":"outils-typo","family":"typo","fr":"Outils typo","en":"Type tools"},
    {"id":"effets","family":"son","fr":"Effets sonores","en":"Sound effects"},
    {"id":"musique","family":"son","fr":"Musique","en":"Music"},
    {"id":"footage","family":"video","fr":"Vidéos","en":"Footage"},
    {"id":"motion","family":"video","fr":"Motion & VFX","en":"Motion & VFX"},
    {"id":"3d","family":"3d","fr":"3D & HDRI","en":"3D & HDRI"},
    {"id":"jeux","family":"3d","fr":"Assets de jeu","en":"Game assets"},
    {"id":"logiciels","family":"outils","fr":"Logiciels","en":"Software"},
    {"id":"en-ligne","family":"outils","fr":"Outils en ligne","en":"Online tools"},
    {"id":"web","family":"outils","fr":"Web & CSS","en":"Web & CSS"},
    {"id":"tutos","family":"apprendre","fr":"Tutos & docs","en":"Tutorials & docs"},
    {"id":"inspi","family":"apprendre","fr":"Inspiration","en":"Inspiration"}
  ],
  "licenses": [
    {"id":"cc0","fr":"Libre total","en":"Public domain","hint":{"fr":"CC0 ou domaine public : tout est permis, même sans citer l'auteur.","en":"CC0 or public domain: anything goes, no credit needed."}},
    {"id":"pro","fr":"Usage pro OK","en":"Commercial OK","hint":{"fr":"Utilisable pour un client sans citer l'auteur. Le site garde quelques limites (pas de revente telle quelle, par exemple).","en":"Fine for client work without credit. The site keeps a few limits (no reselling as is, for example)."}},
    {"id":"credit","fr":"Crédit obligatoire","en":"Credit required","hint":{"fr":"Usage pro possible, à condition de citer l'auteur comme demandé.","en":"Commercial use is fine as long as you credit the author as asked."}},
    {"id":"perso","fr":"Perso uniquement","en":"Personal use only","hint":{"fr":"Pour tes projets perso. Pour un client, il faut une autre licence.","en":"For personal projects. Client work needs another license."}},
    {"id":"mixte","fr":"Selon le fichier","en":"Varies by file","hint":{"fr":"Chaque fichier a sa propre licence : regarde-la avant de télécharger.","en":"Each file has its own license: check it before downloading."}},
    {"id":"opensource","fr":"Open source","en":"Open source","hint":{"fr":"Logiciel libre et gratuit. Ce que tu crées avec t'appartient.","en":"Free, open source software. What you make with it is yours."}},
    {"id":"outil","fr":"Outil gratuit","en":"Free tool","hint":{"fr":"Outil gratuit. Ce que tu crées avec t'appartient.","en":"Free tool. What you make with it is yours."}}
  ],
  // Anciens liens « #cats=… » : ancienne catégorie → nouvelle sous-catégorie (null : rien, ou la licence du même nom).
  "legacyCats": {"images":"photos","polices":"polices","icones":"icones","illustrations":"illustrations","couleurs":"couleurs","design":"logiciels","sons":"effets","musiques":"musique","mockups":"mockups","jeux":"jeux","web":"web","video":"footage","textures":"textures","brushes":"brushes","png":"photos","outils":"en-ligne","tutos":"tutos","inspi":"inspi","motion":"motion","3d":"3d","opensource":null,"ia":null,"ai-skills":null},
  "resources": [
    {
      "name": "Unsplash",
      "url": "https://unsplash.com",
      "emoji": "🌄",
      "cats": ["photos"],
      "license": "pro",
      "licenseName": "Unsplash License",
      "account": false,
      "desc": {"fr":"Photos haute résolution sous licence Unsplash, usage commercial sans crédit ; les photos Unsplash+ sont payantes.","en":"High-resolution photos under the Unsplash License, commercial use without credit; Unsplash+ photos in results are paid."}
    },
    {
      "name": "Pexels",
      "url": "https://www.pexels.com",
      "emoji": "📷",
      "cats": ["photos","footage"],
      "license": "pro",
      "licenseName": "Pexels License",
      "account": false,
      "desc": {"fr":"Photos et vidéos HD sous licence Pexels, usage commercial sans crédit ; revente des fichiers tels quels interdite.","en":"HD photos and videos under the Pexels License, commercial use without credit; selling unmodified copies is not allowed."}
    },
    {
      "name": "Pixabay",
      "url": "https://pixabay.com",
      "emoji": "🖼️",
      "cats": ["photos","illustrations","footage"],
      "license": "pro",
      "licenseName": "Pixabay Content License",
      "account": false,
      "desc": {"fr":"Photos, vecteurs, illustrations et vidéos sous licence Pixabay : usage commercial sans crédit, revente brute interdite.","en":"Photos, illustrations, vectors and videos under the Pixabay license, commercial use without credit, no reselling as is."}
    },
    {
      "name": "Pixabay Audio",
      "url": "https://pixabay.com/music/",
      "emoji": "🎶",
      "cats": ["musique","effets"],
      "license": "pro",
      "licenseName": "Pixabay Content License",
      "account": false,
      "desc": {"fr":"Musiques et bruitages sous licence Pixabay, sans crédit ; certains morceaux déclenchent des réclamations Content ID.","en":"Music and sound effects under the Pixabay license, no credit needed; some tracks trigger YouTube Content ID claims."}
    },
    {
      "name": "StockSnap",
      "url": "https://stocksnap.io",
      "emoji": "📸",
      "cats": ["photos"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Photos haute résolution en CC0, à utiliser librement, même pour un client, sans citer l'auteur.","en":"High-resolution CC0 photos you can use freely, client work included, with no credit needed."}
    },
    {
      "name": "Burst",
      "url": "https://burst.shopify.com",
      "emoji": "⚡",
      "cats": ["photos"],
      "license": "pro",
      "licenseName": "CC0, Burst License",
      "account": false,
      "desc": {"fr":"Photos gratuites de Shopify en CC0 ou sous licence Burst : usage commercial sans crédit, pas de revente telle quelle.","en":"Free photos by Shopify under CC0 or the Burst license: commercial use without credit, no reselling as is."}
    },
    {
      "name": "Life of Pix",
      "url": "https://www.lifeofpix.com",
      "emoji": "🌿",
      "cats": ["photos"],
      "license": "pro",
      "licenseName": "Life of Pix License",
      "account": false,
      "desc": {"fr":"Photos haute résolution sous licence maison, usage commercial sans crédit ; pas de revente sans vraie modification.","en":"High-resolution photos under the site's own license, commercial use without credit; no reselling without real changes."}
    },
    {
      "name": "Rawpixel Public Domain",
      "url": "https://www.rawpixel.com/public-domain",
      "emoji": "🏛️",
      "cats": ["photos","illustrations"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": true,
      "desc": {"fr":"Œuvres d'art, photos et gravures anciennes du domaine public (CC0) ; compte gratuit requis, images premium mélangées.","en":"Public domain artworks, photos and old prints (CC0); free account required, and premium images are mixed in."}
    },
    {
      "name": "Public.work",
      "url": "https://public.work/",
      "emoji": "🔍",
      "cats": ["photos","illustrations"],
      "license": "cc0",
      "licenseName": "Public Domain, CC0",
      "account": false,
      "desc": {"fr":"Moteur de recherche visuel d'images du domaine public issues de musées (The Met, New York Public Library), par Cosmos.","en":"Visual search engine for public domain images from museum collections (The Met, New York Public Library), by Cosmos."}
    },
    {
      "name": "ISO Republic",
      "url": "https://isorepublic.com/",
      "emoji": "🌐",
      "cats": ["photos","footage"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Photos et vidéos HD en CC0, usage commercial sans crédit obligatoire (un crédit reste apprécié).","en":"HD photos and videos under CC0, commercial use with no credit required (credit is appreciated)."}
    },
    {
      "name": "Google Fonts",
      "url": "https://fonts.google.com",
      "emoji": "🔡",
      "cats": ["polices"],
      "license": "pro",
      "licenseName": "SIL OFL, Apache 2.0",
      "account": false,
      "desc": {"fr":"Polices libres, surtout sous SIL OFL, à télécharger ou à intégrer en CSS, usage commercial permis.","en":"Open source fonts, mostly under SIL OFL, to download or embed with CSS, commercial use allowed."}
    },
    {
      "name": "Font Squirrel",
      "url": "https://www.fontsquirrel.com",
      "emoji": "🐿️",
      "cats": ["polices"],
      "license": "pro",
      "licenseName": "SIL OFL, Apache 2.0, Freeware",
      "account": false,
      "desc": {"fr":"Polices gratuites choisies pour l'usage commercial ; lire la licence de chaque police, certaines limitent l'usage web.","en":"Free fonts picked for commercial use; read each font's license, as some restrict web or ebook embedding."}
    },
    {
      "name": "Fontesk",
      "url": "https://fontesk.com",
      "emoji": "✍️",
      "cats": ["polices"],
      "license": "mixte",
      "licenseName": "SIL OFL, Freeware, Personal use",
      "account": false,
      "desc": {"fr":"Agrégateur de polices gratuites avec filtre de licence (OFL, commercial, perso seulement) : vérifier chaque fiche.","en":"Free font aggregator with a license filter (OFL, commercial use, personal use only): check each font's page."}
    },
    {
      "name": "Free Faces",
      "url": "https://www.freefaces.gallery/",
      "emoji": "🖼️",
      "cats": ["polices"],
      "license": "mixte",
      "licenseName": "SIL OFL, ITF FFL, CC BY, CC BY-NC",
      "account": false,
      "desc": {"fr":"Galerie de polices gratuites repérées sur le web, téléchargées chez l'auteur ; licence notée sur chaque fiche.","en":"Gallery of free fonts found across the web, downloaded from the designer's site; license shown on each page."}
    },
    {
      "name": "Fontshare",
      "url": "https://www.fontshare.com/",
      "emoji": "🤝",
      "cats": ["polices"],
      "license": "pro",
      "licenseName": "ITF FFL, SIL OFL",
      "account": false,
      "desc": {"fr":"Polices gratuites de l'Indian Type Foundry, usage perso et commercial (licence ITF FFL ou SIL OFL), sans compte.","en":"Free fonts from the Indian Type Foundry for personal and commercial use (ITF FFL or SIL OFL), no account needed."}
    },
    {
      "name": "Velvetyne",
      "url": "https://velvetyne.fr/",
      "emoji": "🧪",
      "cats": ["polices"],
      "license": "pro",
      "licenseName": "SIL OFL",
      "account": false,
      "desc": {"fr":"Fonderie française de polices libres et expérimentales, surtout sous SIL OFL, usage commercial permis.","en":"French foundry of experimental open source fonts, mostly under SIL OFL, commercial use allowed."}
    },
    {
      "name": "Open Foundry",
      "url": "https://open-foundry.com/fonts",
      "emoji": "🔓",
      "cats": ["polices"],
      "license": "pro",
      "licenseName": "SIL OFL",
      "account": false,
      "desc": {"fr":"Sélection de polices open source, surtout sous SIL OFL ; le téléchargement se fait sur la page de chaque projet.","en":"Curated open source fonts, mostly under SIL OFL; downloads happen on each project's own page."}
    },
    {
      "name": "FontJoy",
      "url": "https://fontjoy.com/",
      "emoji": "🎯",
      "cats": ["outils-typo"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Générateur de trios de polices Google Fonts : on verrouille celles qu'on garde, il propose les autres.","en":"Generates trios of Google Fonts: lock the ones you want to keep and it suggests the others."}
    },
    {
      "name": "Unblast Fonts",
      "url": "https://unblast.com/fonts/",
      "emoji": "💥",
      "cats": ["polices"],
      "license": "mixte",
      "licenseName": "Freeware, Personal use",
      "account": false,
      "desc": {"fr":"Polices gratuites : celles d'Unblast sont libres en usage commercial, celles des contributeurs parfois en perso.","en":"Free fonts: Unblast's own are fine for commercial use, contributors' fonts are sometimes personal use only."}
    },
    {
      "name": "Fonts In Use",
      "url": "https://fontsinuse.com/",
      "emoji": "🔍",
      "cats": ["inspi","outils-typo"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Archive de polices repérées sur des affiches, livres, logos et sites, avec le nom de chaque police utilisée.","en":"Archive of typefaces spotted on posters, books, logos and websites, naming each font used."}
    },
    {
      "name": "Heroicons",
      "url": "https://heroicons.com",
      "emoji": "⚡",
      "cats": ["icones"],
      "license": "pro",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Icônes SVG de l'équipe Tailwind CSS sous licence MIT, en versions contour et plein, à copier en SVG ou JSX.","en":"SVG icons from the Tailwind CSS team under the MIT license, in outline and solid styles, copied as SVG or JSX."}
    },
    {
      "name": "Lucide",
      "url": "https://lucide.dev",
      "emoji": "🌟",
      "cats": ["icones"],
      "license": "pro",
      "licenseName": "ISC, MIT",
      "account": false,
      "desc": {"fr":"Icônes SVG à trait sous licence ISC, fork de Feather Icons, avec des paquets pour React, Vue et d'autres outils.","en":"Stroke-based SVG icons under the ISC license, forked from Feather Icons, with packages for React, Vue and more."}
    },
    {
      "name": "SVG Repo",
      "url": "https://www.svgrepo.com",
      "emoji": "🔷",
      "cats": ["icones","illustrations"],
      "license": "mixte",
      "licenseName": "CC0, MIT, Apache 2.0, CC BY",
      "account": false,
      "desc": {"fr":"Icônes et vecteurs SVG sous licences ouvertes (CC0, MIT, CC BY) ; la licence varie, elle est notée sur chaque fichier.","en":"SVG icons and vectors under open licenses (CC0, MIT, CC BY); the license varies and is shown on each file."}
    },
    {
      "name": "Tabler Icons",
      "url": "https://tabler.io/icons",
      "emoji": "📐",
      "cats": ["icones"],
      "license": "pro",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Icônes SVG à trait sous licence MIT, réglables en épaisseur, taille et couleur avant le téléchargement.","en":"Stroke SVG icons under the MIT license; set stroke width, size and colour before downloading."}
    },
    {
      "name": "Phosphor Icons",
      "url": "https://phosphoricons.com",
      "emoji": "🧪",
      "cats": ["icones"],
      "license": "pro",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Icônes sous licence MIT, chacune en six graisses : thin, light, regular, bold, fill et duotone.","en":"Icons under the MIT license, each in six weights: thin, light, regular, bold, fill and duotone."}
    },
    {
      "name": "Ionicons",
      "url": "https://ionic.io/ionicons",
      "emoji": "⚡",
      "cats": ["icones"],
      "license": "pro",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Icônes open source d'Ionic sous licence MIT, en styles contour, plein et anguleux, pour le web et les apps.","en":"Open source icons by Ionic under the MIT license, in outline, filled and sharp styles, for web and apps."}
    },
    {
      "name": "Simple Icons",
      "url": "https://simpleicons.org/",
      "emoji": "🏷️",
      "cats": ["icones"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Logos de marques en SVG sous CC0 ; les marques restent déposées, à utiliser selon la charte de chacune.","en":"Brand logos as SVG under CC0; the brands are still trademarks, so follow each brand's guidelines."}
    },
    {
      "name": "Iconify",
      "url": "https://icon-sets.iconify.design",
      "emoji": "🔗",
      "cats": ["icones","web"],
      "license": "mixte",
      "licenseName": "MIT, Apache 2.0, CC BY 4.0, SIL OFL",
      "account": false,
      "desc": {"fr":"Plus de 200 sets d'icônes open source au même endroit, filtrables par licence, à utiliser en SVG, CSS ou JS.","en":"Over 200 open source icon sets in one place, filterable by license, usable as SVG, CSS or JS."}
    },
    {
      "name": "Iconduck",
      "url": "https://iconduck.com/",
      "emoji": "🦆",
      "cats": ["icones","illustrations"],
      "license": "mixte",
      "licenseName": "MIT, CC BY 4.0",
      "account": false,
      "desc": {"fr":"Icônes, emojis, illustrations et drapeaux gratuits ; licence notée sur chaque fichier, certaines demandent un crédit.","en":"Free icons, emojis, illustrations and flags; the license is shown on each file and some require credit."}
    },
    {
      "name": "Glyphter",
      "url": "https://www.glyphter.com/",
      "emoji": "✏️",
      "cats": ["en-ligne","icones"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Transforme des SVG en police d'icônes ; gratuit pour une petite grille, Premium (achat unique) pour une plus grande.","en":"Turns SVG files into an icon font; free for a small grid, Premium (one-time purchase) for a larger one."}
    },
    {
      "name": "unDraw",
      "url": "https://undraw.co",
      "emoji": "🎨",
      "cats": ["illustrations"],
      "license": "pro",
      "licenseName": "unDraw License",
      "account": false,
      "desc": {"fr":"Illustrations SVG dont on choisit la couleur, usage commercial sans crédit ; ni revente en pack ni entraînement d'IA.","en":"SVG illustrations in the colour you pick, commercial use without credit; no reselling as packs and no AI training."}
    },
    {
      "name": "Storyset",
      "url": "https://storyset.com",
      "emoji": "📖",
      "cats": ["illustrations"],
      "license": "credit",
      "licenseName": "Freepik License",
      "account": false,
      "desc": {"fr":"Illustrations de Freepik à personnaliser et animer en ligne, gratuites avec un crédit obligatoire à Storyset.","en":"Freepik illustrations you can customise and animate online, free with mandatory credit to Storyset."}
    },
    {
      "name": "Open Doodles",
      "url": "https://opendoodles.com",
      "emoji": "✏️",
      "cats": ["illustrations"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Dessins de personnages au trait en CC0, en SVG, PNG ou GIF, avec un outil en ligne pour changer les couleurs.","en":"Hand-drawn character sketches under CC0, as SVG, PNG or GIF, with an online tool to change the colours."}
    },
    {
      "name": "Humaaans",
      "url": "https://www.humaaans.com",
      "emoji": "👥",
      "cats": ["illustrations"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Personnages à composer (coiffure, haut, bas, pose) en CC0, par Pablo Stanley ; téléchargement à prix libre, 0 € accepté.","en":"Mix-and-match people (hair, tops, bottoms, poses) under CC0, by Pablo Stanley; pay what you want, zero accepted."}
    },
    {
      "name": "Open Peeps",
      "url": "https://openpeeps.com/",
      "emoji": "🙋",
      "cats": ["illustrations"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Personnages dessinés à la main à combiner, en CC0, par Pablo Stanley ; PNG et SVG, bibliothèque complète à prix libre.","en":"Hand-drawn mix-and-match characters under CC0, by Pablo Stanley; PNG and SVG, full library at pay what you want."}
    },
    {
      "name": "Lukasz Adam",
      "url": "https://lukaszadam.com/illustrations",
      "emoji": "◻️",
      "cats": ["illustrations"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Séries d'illustrations minimalistes de Lukasz Adam en CC0, usage perso et commercial sans crédit.","en":"Sets of minimalist illustrations by Lukasz Adam under CC0, for personal and commercial use without credit."}
    },
    {
      "name": "Internet Archive Book Images",
      "url": "https://www.flickr.com/photos/internetarchivebookimages/",
      "emoji": "📖",
      "cats": ["illustrations","photos"],
      "license": "cc0",
      "licenseName": "No known copyright restrictions",
      "account": false,
      "desc": {"fr":"Illustrations tirées de livres anciens numérisés par l'Internet Archive, sur Flickr, sans restriction de droits connue.","en":"Illustrations taken from old books scanned by the Internet Archive, on Flickr, with no known copyright restrictions."}
    },
    {
      "name": "Adobe Color",
      "url": "https://color.adobe.com",
      "emoji": "🌈",
      "cats": ["couleurs"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Roue chromatique pour bâtir des palettes selon les règles d'harmonie ; compte Adobe gratuit pour les enregistrer.","en":"Colour wheel to build palettes from harmony rules; a free Adobe account is needed to save them."}
    },
    {
      "name": "Color Hunt",
      "url": "https://colorhunt.co",
      "emoji": "🎯",
      "cats": ["couleurs"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Palettes de quatre couleurs proposées par la communauté, codes HEX à copier, sans compte.","en":"Four-colour palettes shared by the community, with HEX codes to copy and no account needed."}
    },
    {
      "name": "Realtime Colors",
      "url": "https://www.realtimecolors.com",
      "emoji": "⚡",
      "cats": ["couleurs","web"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Palette appliquée en direct sur une maquette de site, avec vérification du contraste et export CSS ou SCSS.","en":"Shows your palette live on a sample website, with a contrast checker and CSS or SCSS export."}
    },
    {
      "name": "UI Colors",
      "url": "https://uicolors.app",
      "emoji": "🔢",
      "cats": ["couleurs","web"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Génère une échelle de nuances prête pour Tailwind à partir d'une couleur ; plugin Figma et app complète payants.","en":"Generates a Tailwind-ready shade scale from one colour; the Figma plugin and full web app are paid."}
    },
    {
      "name": "Resourceboy Gradients",
      "url": "https://resourceboy.com/photoshop-gradients/",
      "emoji": "🎨",
      "cats": ["couleurs"],
      "license": "mixte",
      "licenseName": "Resource Boy License, others",
      "account": false,
      "desc": {"fr":"Packs de dégradés gratuits (.grd) pour Photoshop, sans compte ; licence propre à chaque pack, à lire sur sa page.","en":"Free gradient packs (.grd) for Photoshop, no account; each pack has its own license, shown on its page."}
    },
    {
      "name": "Gradient Hunt",
      "url": "https://gradienthunt.com/",
      "emoji": "🌈",
      "cats": ["couleurs","web"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Galerie de dégradés mise à jour chaque jour, avec le code CSS de chaque dégradé à copier.","en":"Gallery of gradients updated daily, with the CSS code of each gradient ready to copy."}
    },
    {
      "name": "Paletton",
      "url": "https://paletton.com/",
      "emoji": "🔵",
      "cats": ["couleurs","en-ligne"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Roue chromatique en ligne pour bâtir des palettes (monochrome, triade, tétrade) et simuler le daltonisme.","en":"Online color wheel to build palettes (mono, triad, tetrad) and preview them with color blindness simulation."}
    },
    {
      "name": "Open Color",
      "url": "https://yeun.github.io/open-color/",
      "emoji": "🎨",
      "cats": ["couleurs","web"],
      "license": "pro",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Palette de couleurs pensée pour les interfaces, fournie en CSS, Sass, Less et JSON, sous licence MIT.","en":"Color palette designed for user interfaces, supplied as CSS, Sass, Less and JSON under the MIT license."}
    },
    {
      "name": "Penpot",
      "url": "https://penpot.app",
      "emoji": "🐾",
      "cats": ["logiciels","en-ligne"],
      "license": "opensource",
      "licenseName": "MPL-2.0",
      "account": true,
      "desc": {"fr":"Alternative open source à Figma, gratuite en ligne jusqu'à 8 personnes par équipe ou auto-hébergée sans limite.","en":"Open source alternative to Figma, free online for teams of up to 8 people or self-hosted with no limit."}
    },
    {
      "name": "Photopea",
      "url": "https://www.photopea.com",
      "emoji": "🖊️",
      "cats": ["en-ligne"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Éditeur d'images dans le navigateur qui ouvre les PSD, XCF et Sketch, gratuit sans compte mais avec publicités.","en":"Image editor in the browser that opens PSD, XCF and Sketch files, free with no account but with ads."}
    },
    {
      "name": "Squoosh",
      "url": "https://squoosh.app",
      "emoji": "🗜️",
      "cats": ["en-ligne"],
      "license": "opensource",
      "licenseName": "Apache-2.0",
      "account": false,
      "desc": {"fr":"Compression et conversion d'images (WebP, AVIF, JPEG) dans le navigateur, avec un avant/après pour régler la qualité.","en":"Image compression and conversion (WebP, AVIF, JPEG) in the browser, with a before/after view to set the quality."}
    },
    {
      "name": "GIMP",
      "url": "https://www.gimp.org/",
      "emoji": "🐶",
      "cats": ["logiciels"],
      "license": "opensource",
      "licenseName": "GPL-3.0",
      "account": false,
      "desc": {"fr":"Éditeur d'images open source (retouche, calques, masques, plugins) pour Windows, macOS et Linux.","en":"Open source image editor (retouching, layers, masks, plugins) for Windows, macOS and Linux."}
    },
    {
      "name": "Krita",
      "url": "https://krita.org/",
      "emoji": "🖌️",
      "cats": ["logiciels"],
      "license": "opensource",
      "licenseName": "GPL-3.0",
      "account": false,
      "desc": {"fr":"Logiciel open source de peinture numérique pour l'illustration, la BD et l'animation image par image.","en":"Open source digital painting app for illustration, comics and frame-by-frame animation."}
    },
    {
      "name": "Inkscape",
      "url": "https://inkscape.org/",
      "emoji": "✒️",
      "cats": ["logiciels"],
      "license": "opensource",
      "licenseName": "GPL-3.0",
      "account": false,
      "desc": {"fr":"Éditeur vectoriel open source, au format SVG, pour logos, illustrations et mise en page, sur Windows, macOS et Linux.","en":"Open source vector editor built on SVG, for logos, illustrations and layouts, on Windows, macOS and Linux."}
    },
    {
      "name": "Lunacy",
      "url": "https://icons8.com/lunacy",
      "emoji": "🌙",
      "cats": ["logiciels"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Logiciel de design d'interface qui ouvre les fichiers Sketch et Figma ; en gratuit, le cloud est limité à 10 documents.","en":"UI design app that opens Sketch and Figma files; on the free plan, cloud storage is capped at 10 documents."}
    },
    {
      "name": "Freesound",
      "url": "https://freesound.org",
      "emoji": "🔊",
      "cats": ["effets"],
      "license": "mixte",
      "licenseName": "CC0, CC BY, CC BY-NC",
      "account": true,
      "desc": {"fr":"Banque collaborative de sons et bruitages, avec une licence par son et un filtre par licence ; compte gratuit requis.","en":"Collaborative bank of sounds and effects, with a license per sound and a license filter; free account required."}
    },
    {
      "name": "Mixkit",
      "url": "https://mixkit.co",
      "emoji": "🎵",
      "cats": ["effets","musique","footage"],
      "license": "pro",
      "licenseName": "Mixkit License",
      "account": false,
      "desc": {"fr":"Effets sonores, musiques et vidéos gratuits, sans compte ni crédit ; musiques exclues des jeux vidéo et de la TV/radio.","en":"Free sound effects, music and stock videos, no account or credit; the music is banned in video games and TV/radio."}
    },
    {
      "name": "Free Music Archive",
      "url": "https://freemusicarchive.org",
      "emoji": "🎸",
      "cats": ["musique"],
      "license": "mixte",
      "licenseName": "CC BY, CC BY-NC, CC BY-SA, CC0",
      "account": false,
      "desc": {"fr":"Archive de morceaux sous Creative Commons, filtrable par usage autorisé ; la licence change d'un morceau à l'autre.","en":"Archive of tracks under Creative Commons licenses, filterable by allowed use; the license changes from track to track."}
    },
    {
      "name": "SoundJay",
      "url": "https://www.soundjay.com/",
      "emoji": "🔔",
      "cats": ["effets"],
      "license": "pro",
      "licenseName": "SoundJay License",
      "account": false,
      "desc": {"fr":"Bruitages et effets sonores gratuits, utilisables en commercial sans crédit ; pas de redistribution des fichiers bruts.","en":"Free sound effects you can use commercially without credit; redistributing the raw files is not allowed."}
    },
    {
      "name": "Big Sound Bank",
      "url": "https://bigsoundbank.com/categories.html",
      "emoji": "🏦",
      "cats": ["effets"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Effets sonores enregistrés par Joseph Sardin, classés par catégorie, sous CC0 et sans compte.","en":"Sound effects recorded by Joseph Sardin, sorted by category, under CC0 and with no account."}
    },
    {
      "name": "ccMixter",
      "url": "https://ccmixter.org/",
      "emoji": "🎛️",
      "cats": ["musique"],
      "license": "mixte",
      "licenseName": "CC BY, CC BY-NC, Sampling+",
      "account": false,
      "desc": {"fr":"Remix, samples et a cappella sous Creative Commons ; usage commercial seulement pour les morceaux en CC BY.","en":"Remixes, samples and a cappellas under Creative Commons; commercial use only for tracks under CC BY."}
    },
    {
      "name": "Incompetech",
      "url": "https://incompetech.com/music/royalty-free/music.html",
      "emoji": "🎹",
      "cats": ["musique"],
      "license": "credit",
      "licenseName": "CC BY 4.0",
      "account": false,
      "desc": {"fr":"Musiques de Kevin MacLeod classées par genre et ambiance, sous CC BY 4.0 : crédit obligatoire.","en":"Music by Kevin MacLeod sorted by genre and mood, under CC BY 4.0: credit required."}
    },
    {
      "name": "NCS",
      "url": "https://ncs.io/",
      "emoji": "⚡",
      "cats": ["musique"],
      "license": "credit",
      "licenseName": "NCS Usage Policy",
      "account": false,
      "desc": {"fr":"Musique électronique gratuite pour vidéos et streams, crédit obligatoire ; jeux, films et pubs de marques exclus.","en":"Free electronic music for videos and streams, credit required; games, films and brand ads are not covered."}
    },
    {
      "name": "Scott Buckley",
      "url": "https://www.scottbuckley.com.au/library/",
      "emoji": "🎻",
      "cats": ["musique"],
      "license": "credit",
      "licenseName": "CC BY 4.0",
      "account": false,
      "desc": {"fr":"Musiques orchestrales et ambiantes de Scott Buckley sous CC BY 4.0, en MP3 sans compte ; crédit obligatoire.","en":"Orchestral and ambient music by Scott Buckley under CC BY 4.0, as MP3s with no account; credit required."}
    },
    {
      "name": "StreamBeats",
      "url": "https://streambeats.com/",
      "emoji": "📡",
      "cats": ["musique"],
      "license": "pro",
      "licenseName": "StreamBeats License",
      "account": false,
      "desc": {"fr":"Musiques de Harris Heller pour streams, vidéos et podcasts, sans crédit ; jeux, films et TV demandent une autre licence.","en":"Music by Harris Heller for streams, videos and podcasts, no credit needed; games, films and TV need another license."}
    },
    {
      "name": "Purple Planet",
      "url": "https://www.purple-planet.com/",
      "emoji": "🪐",
      "cats": ["musique"],
      "license": "perso",
      "licenseName": "Purple Planet License",
      "account": false,
      "desc": {"fr":"Musiques gratuites pour projets perso et réseaux sociaux, crédit obligatoire ; usage commercial payant.","en":"Free music for personal projects and social media, credit required; commercial use is paid."}
    },
    {
      "name": "Film Music IO",
      "url": "https://filmmusic.io/en",
      "emoji": "🎬",
      "cats": ["musique"],
      "license": "credit",
      "licenseName": "CC BY 4.0",
      "account": false,
      "desc": {"fr":"Musiques sous CC BY 4.0, surtout de Kevin MacLeod, avec le texte de crédit fourni au téléchargement.","en":"Music under CC BY 4.0, mostly by Kevin MacLeod, with the credit text supplied when you download."}
    },
    {
      "name": "Free Stock Music",
      "url": "https://www.free-stock-music.com/",
      "emoji": "🗂️",
      "cats": ["musique"],
      "license": "credit",
      "licenseName": "CC BY 4.0, CC BY-SA 3.0",
      "account": false,
      "desc": {"fr":"Musiques gratuites pour vidéos et podcasts, surtout sous CC BY ; crédit du site et de l'artiste obligatoire.","en":"Free music for videos and podcasts, mostly under CC BY; credit to the site and the artist required."}
    },
    {
      "name": "Silverman Sound",
      "url": "https://www.silvermansound.com/free-music",
      "emoji": "🥈",
      "cats": ["musique"],
      "license": "credit",
      "licenseName": "CC BY 4.0",
      "account": false,
      "desc": {"fr":"Compositions de Shane Ivers en MP3 sous CC BY 4.0 : usage commercial permis, crédit et lien obligatoires.","en":"Tracks by Shane Ivers as MP3s under CC BY 4.0: commercial use allowed, credit and link required."}
    },
    {
      "name": "Moby Gratis",
      "url": "https://mobygratis.com/",
      "emoji": "🐋",
      "cats": ["musique"],
      "license": "perso",
      "licenseName": "mobygratis License",
      "account": true,
      "desc": {"fr":"Morceaux instrumentaux de Moby (MP3, WAV, pistes séparées), gratuits hors usage commercial ; inscription requise.","en":"Instrumental tracks by Moby (MP3, WAV, stems), free for non-commercial projects; sign-up required."}
    },
    {
      "name": "GraphicBurger",
      "url": "https://graphicburger.com",
      "emoji": "🍔",
      "cats": ["mockups","textures"],
      "license": "pro",
      "licenseName": "GraphicBurger License",
      "account": false,
      "desc": {"fr":"Mockups, textures et UI kits en PSD, utilisables en commercial sans crédit ; pas de redistribution des fichiers.","en":"Mockups, textures and UI kits as PSDs, usable commercially without credit; no redistribution of the files."}
    },
    {
      "name": "Resourceboy Mockups",
      "url": "https://resourceboy.com/mockups/",
      "emoji": "📦",
      "cats": ["mockups"],
      "license": "mixte",
      "licenseName": "Resource Boy License, others",
      "account": false,
      "desc": {"fr":"Mockups gratuits (appareils, print, packaging) sans compte ; licence propre à chaque fichier, à lire sur sa page.","en":"Free mockups (devices, print, packaging) with no account; each file has its own license, shown on its page."}
    },
    {
      "name": "Mockuphone",
      "url": "https://mockuphone.com/",
      "emoji": "📱",
      "cats": ["mockups","en-ligne"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Place une capture d'écran dans un cadre de smartphone, tablette, montre ou TV, puis l'exporte en PNG.","en":"Puts a screenshot into a phone, tablet, watch or TV frame, then exports it as a PNG."}
    },
    {
      "name": "Screely",
      "url": "https://screely.com",
      "emoji": "🖼️",
      "cats": ["mockups","en-ligne"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Ajoute un cadre de navigateur et un fond à une capture d'écran, avec export sans inscription.","en":"Adds a browser frame and a background to a screenshot, with export and no sign-up."}
    },
    {
      "name": "Material Maker",
      "url": "https://www.materialmaker.org/",
      "emoji": "🧱",
      "cats": ["logiciels","textures","3d"],
      "license": "opensource",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Éditeur open source de matériaux PBR par nœuds, fait avec Godot ; exporte vers Godot, Unity, Unreal et Blender.","en":"Open source node-based PBR material editor built with Godot; exports to Godot, Unity, Unreal and Blender."}
    },
    {
      "name": "Godot Shaders",
      "url": "https://godotshaders.com/",
      "emoji": "✨",
      "cats": ["jeux"],
      "license": "mixte",
      "licenseName": "CC0, MIT, GPL-3.0, CC BY-NC-SA",
      "account": false,
      "desc": {"fr":"Shaders partagés pour le moteur Godot, la plupart en CC0 ; les portages de Shadertoy restent non commerciaux.","en":"Shaders shared for the Godot engine, most under CC0; ports from Shadertoy stay non-commercial."}
    },
    {
      "name": "Shadertoy",
      "url": "https://www.shadertoy.com/",
      "emoji": "🔮",
      "cats": ["web","jeux"],
      "license": "perso",
      "licenseName": "CC BY-NC-SA 3.0",
      "account": false,
      "desc": {"fr":"Éditeur en ligne pour écrire et partager des shaders GLSL ; les shaders publiés sont non commerciaux par défaut.","en":"Online editor to write and share GLSL shaders; published shaders are non-commercial by default."}
    },
    {
      "name": "Tilemancer",
      "url": "https://led.itch.io/tilemancer",
      "emoji": "🧩",
      "cats": ["logiciels","jeux"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Générateur procédural de tuiles pixel art pour Windows et macOS, à prix libre ; développement arrêté en 2019.","en":"Procedural pixel art tile generator for Windows and macOS, pay what you want; development stopped in 2019."}
    },
    {
      "name": "LPC Spritesheet Generator",
      "url": "https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/",
      "emoji": "🧍",
      "cats": ["jeux","en-ligne"],
      "license": "credit",
      "licenseName": "CC BY-SA 4.0, GPL-3.0, OGA-BY, CC0",
      "account": false,
      "desc": {"fr":"Assemble un personnage LPC en sprite sheet animée ; usage commercial possible en créditant chaque auteur listé.","en":"Builds an LPC character as an animated sprite sheet; commercial use is fine if you credit every listed author."}
    },
    {
      "name": "LibreSprite",
      "url": "https://libresprite.github.io/",
      "emoji": "🖼️",
      "cats": ["logiciels","jeux"],
      "license": "opensource",
      "licenseName": "GPL-2.0",
      "account": false,
      "desc": {"fr":"Éditeur open source de pixel art et d'animation, issu de la dernière version libre d'Aseprite (2016).","en":"Open source pixel art and animation editor, forked from the last open source version of Aseprite (2016)."}
    },
    {
      "name": "Piskel",
      "url": "https://www.piskelapp.com/",
      "emoji": "🎨",
      "cats": ["logiciels","jeux","en-ligne"],
      "license": "opensource",
      "licenseName": "Apache-2.0",
      "account": false,
      "desc": {"fr":"Éditeur de pixel art open source dans le navigateur ou hors ligne, avec export en sprite sheet et GIF animé.","en":"Open source pixel art editor in the browser or offline, with export to sprite sheets and animated GIFs."}
    },
    {
      "name": "MagicaVoxel",
      "url": "https://ephtracy.github.io/",
      "emoji": "🧊",
      "cats": ["logiciels","3d","jeux"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Éditeur de voxels gratuit avec moteur de rendu intégré, pour Windows et macOS ; modèles utilisables en commercial.","en":"Free voxel editor with a built-in renderer, for Windows and macOS; the models you make can be used commercially."}
    },
    {
      "name": "Blockbench",
      "url": "https://www.blockbench.net/",
      "emoji": "🟦",
      "cats": ["logiciels","3d","jeux"],
      "license": "opensource",
      "licenseName": "GPL-3.0",
      "account": false,
      "desc": {"fr":"Modeleur 3D low-poly open source avec textures pixel art, pensé pour Minecraft, qui exporte en glTF, OBJ et FBX.","en":"Open source low-poly 3D modeler with pixel art textures, made for Minecraft, that exports to glTF, OBJ and FBX."}
    },
    {
      "name": "Tiled",
      "url": "https://www.mapeditor.org/",
      "emoji": "🗾",
      "cats": ["logiciels","jeux"],
      "license": "opensource",
      "licenseName": "GPL-2.0",
      "account": false,
      "desc": {"fr":"Éditeur open source de cartes 2D en tuiles (orthogonales, isométriques, hexagonales), avec export JSON et TMX.","en":"Open source 2D tile map editor (orthogonal, isometric, hexagonal), with JSON and TMX export."}
    },
    {
      "name": "TrenchBroom",
      "url": "https://trenchbroom.github.io/",
      "emoji": "🏗️",
      "cats": ["logiciels","jeux","3d"],
      "license": "opensource",
      "licenseName": "GPL-3.0",
      "account": false,
      "desc": {"fr":"Éditeur open source de niveaux 3D pour les jeux sur moteur Quake (Quake, Quake 2, Hexen 2).","en":"Open source 3D level editor for Quake-engine games (Quake, Quake 2, Hexen 2)."}
    },
    {
      "name": "OpenGameArt",
      "url": "https://opengameart.org/",
      "emoji": "🎭",
      "cats": ["jeux","musique","effets"],
      "license": "mixte",
      "licenseName": "CC0, CC BY, CC BY-SA, OGA-BY, GPL",
      "account": false,
      "desc": {"fr":"Sprites, modèles 3D, musiques et bruitages pour jeux, partagés par la communauté ; licence propre à chaque fichier.","en":"Sprites, 3D models, music and sound effects for games, shared by the community; each file has its own license."}
    },
    {
      "name": "Quaternius",
      "url": "https://quaternius.com/",
      "emoji": "🐉",
      "cats": ["3d","jeux"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Packs de modèles 3D low-poly (personnages animés, décors, armes) en FBX, OBJ et glTF, sous CC0.","en":"Packs of low-poly 3D models (animated characters, scenery, weapons) as FBX, OBJ and glTF, under CC0."}
    },
    {
      "name": "Poly Haven",
      "url": "https://polyhaven.com/",
      "emoji": "🌐",
      "cats": ["3d","textures"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"HDRI, textures PBR et modèles 3D sous CC0, téléchargeables sans compte et sans crédit.","en":"HDRIs, PBR textures and 3D models under CC0, to download with no account and no credit."}
    },
    {
      "name": "ambientCG",
      "url": "https://ambientcg.com/",
      "emoji": "🪨",
      "cats": ["textures","3d"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Matériaux PBR, HDRI et textures sous CC0, jusqu'en 8K, à télécharger sans compte.","en":"PBR materials, HDRIs and textures under CC0, up to 8K, to download with no account."}
    },
    {
      "name": "Game UI Database",
      "url": "https://www.gameuidatabase.com/",
      "emoji": "🖥️",
      "cats": ["inspi","jeux"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Captures d'interfaces de jeux (menus, HUD, inventaires) filtrables par écran : pour s'inspirer, rien à réutiliser.","en":"Screenshots of game interfaces (menus, HUDs, inventories) filtered by screen type: for reference, not for reuse."}
    },
    {
      "name": "Kenney",
      "url": "https://kenney.nl/",
      "emoji": "🏆",
      "cats": ["jeux","3d","effets"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Milliers d'assets de jeu en CC0 : sprites 2D, kits 3D, interfaces et effets sonores, sans crédit obligatoire.","en":"Thousands of CC0 game assets: 2D sprites, 3D kits, UI packs and sound effects, no credit required."}
    },
    {
      "name": "itch.io — Free Assets",
      "url": "https://itch.io/game-assets/free",
      "emoji": "🎮",
      "cats": ["jeux","3d","effets"],
      "license": "mixte",
      "licenseName": "CC0, CC BY, custom licenses",
      "account": false,
      "desc": {"fr":"Assets de jeu gratuits d'itch.io : sprites, tilesets, sons, 3D. Licence propre à chaque pack, à lire sur sa page.","en":"Free game assets on itch.io: sprites, tilesets, sounds, 3D. Each pack has its own license, shown on its page."}
    },
    {
      "name": "Coverr",
      "url": "https://coverr.co/",
      "emoji": "🎥",
      "cats": ["footage"],
      "license": "pro",
      "licenseName": "Coverr License",
      "account": false,
      "desc": {"fr":"Vidéos de stock sans filigrane, usage commercial sans crédit ; une partie est générée par IA (signalée).","en":"Stock videos without watermarks, commercial use without credit; some clips are AI-generated (labelled)."}
    },
    {
      "name": "Mazwai",
      "url": "https://mazwai.com/",
      "emoji": "🎞️",
      "cats": ["footage"],
      "license": "mixte",
      "licenseName": "CC BY 3.0, Mazwai License",
      "account": false,
      "desc": {"fr":"Clips vidéo cinématographiques gratuits, usage commercial OK ; certains clips (CC BY 3.0) demandent un crédit.","en":"Free cinematic video clips for commercial use; some clips (CC BY 3.0) require credit to the author."}
    },
    {
      "name": "TextureFabrik",
      "url": "https://texturefabrik.com/gallery/",
      "emoji": "🧱",
      "cats": ["textures"],
      "license": "credit",
      "licenseName": "TextureFabrik License",
      "account": false,
      "desc": {"fr":"Galerie de textures scannées en haute résolution ; crédit apprécié, revente des fichiers bruts interdite.","en":"Gallery of high-resolution scanned textures; credit appreciated, reselling the raw files is not allowed."}
    },
    {
      "name": "Brusheezy",
      "url": "https://www.brusheezy.com/",
      "emoji": "🎨",
      "cats": ["brushes","textures"],
      "license": "credit",
      "licenseName": "Brusheezy Free License",
      "account": false,
      "desc": {"fr":"Brosses Photoshop, motifs et textures ; en version gratuite, usage commercial possible avec crédit obligatoire.","en":"Photoshop brushes, patterns and textures; the free license allows commercial use with credit required."}
    },
    {
      "name": "Space Type Generator",
      "url": "https://spacetypegenerator.com/",
      "emoji": "🌌",
      "cats": ["outils-typo","motion","en-ligne"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Petits outils web d'animation typographique (rubans, cylindres, ondes) à exporter en image ou en vidéo.","en":"Small web tools for kinetic type (ribbons, cylinders, waves) that export as images or video."}
    },
    {
      "name": "Inclusive Colors",
      "url": "https://www.inclusivecolors.com/",
      "emoji": "♿",
      "cats": ["couleurs","en-ligne"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Crée des palettes de couleurs accessibles, contrastes WCAG vérifiés, à exporter en CSS ou pour Tailwind.","en":"Builds accessible color palettes with checked WCAG contrast, exported as CSS or for Tailwind."}
    },
    {
      "name": "Vectorpea",
      "url": "https://www.vectorpea.com/",
      "emoji": "✒️",
      "cats": ["en-ligne"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Éditeur vectoriel dans le navigateur, par l'auteur de Photopea ; ouvre et exporte SVG et PDF, avec publicités.","en":"Vector editor in the browser by the maker of Photopea; opens and exports SVG and PDF, with ads."}
    },
    {
      "name": "Wordmark.it",
      "url": "https://wordmark.it/",
      "emoji": "🔤",
      "cats": ["outils-typo"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Tape un mot et vois-le d'un coup dans toutes les polices installées sur ton ordinateur.","en":"Type a word and see it at once in every font installed on your computer."}
    },
    {
      "name": "WhatTheFont",
      "url": "https://www.myfonts.com/pages/whatthefont",
      "emoji": "🔍",
      "cats": ["outils-typo"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Identifie une police à partir d'une image (par MyFonts) ; les polices proposées sont surtout payantes.","en":"Identifies a font from an image (by MyFonts); the matching fonts it suggests are mostly paid."}
    },
    {
      "name": "Metatags.io",
      "url": "https://metatags.io/",
      "emoji": "🏷️",
      "cats": ["web"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Prévisualise et génère les balises meta d'une page pour Google et les aperçus de partage sur les réseaux.","en":"Previews and generates a page's meta tags for Google and for link previews on social networks."}
    },
    {
      "name": "FontBrief",
      "url": "https://www.fontbrief.com/",
      "emoji": "📋",
      "cats": ["outils-typo"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Trouve une police par sa personnalité (chaleureuse, audacieuse...) ; les polices proposées ne sont pas toutes gratuites.","en":"Finds a typeface by its personality (warm, daring...); the suggested fonts are not all free."}
    },
    {
      "name": "Tooooools",
      "url": "https://www.tooooools.app/",
      "emoji": "🧰",
      "cats": ["en-ligne"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Petits outils dans le navigateur pour appliquer des effets d'image (trame, dithering, ASCII) et les exporter.","en":"Small browser tools that apply image effects (halftone, dithering, ASCII) and export the result."}
    },
    {
      "name": "CSS Gradient",
      "url": "https://cssgradient.io/",
      "emoji": "🌈",
      "cats": ["web","couleurs"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Générateur de dégradés CSS avec aperçu en direct ; le code produit se copie et t'appartient.","en":"CSS gradient generator with a live preview; copy the code it makes and use it as you like."}
    },
    {
      "name": "Haikei",
      "url": "https://haikei.app/",
      "emoji": "🌊",
      "cats": ["en-ligne","web"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Génère des fonds SVG (vagues, blobs, dégradés, grilles) réglables, à exporter en SVG ou PNG.","en":"Generates adjustable SVG backgrounds (waves, blobs, gradients, grids) to export as SVG or PNG."}
    },
    {
      "name": "Animista",
      "url": "https://animista.net/",
      "emoji": "💫",
      "cats": ["web","motion"],
      "license": "pro",
      "licenseName": "BSD-2-Clause",
      "account": false,
      "desc": {"fr":"Animations CSS prêtes à l'emploi, réglables et prévisualisées ; le code généré est sous licence FreeBSD.","en":"Ready-made CSS animations you can tweak and preview; the generated code is under the FreeBSD license."}
    },
    {
      "name": "Hero Patterns",
      "url": "https://heropatterns.com/",
      "emoji": "🔷",
      "cats": ["web","textures"],
      "license": "credit",
      "licenseName": "CC BY 4.0",
      "account": false,
      "desc": {"fr":"Motifs SVG répétables aux couleurs réglables pour fonds web ; CC BY 4.0, crédit à Steve Schoger demandé.","en":"Repeatable SVG patterns with adjustable colors for web backgrounds; CC BY 4.0, credit Steve Schoger."}
    },
    {
      "name": "Neumorphism.io",
      "url": "https://neumorphism.io/",
      "emoji": "⬜",
      "cats": ["web"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Génère le CSS d'ombres en relief doux (neumorphisme) à partir d'une couleur, de la taille et du rayon.","en":"Generates the CSS for soft embossed shadows (neumorphism) from a color, size and radius."}
    },
    {
      "name": "CSS Loaders",
      "url": "https://css-loaders.com/",
      "emoji": "⏳",
      "cats": ["web"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Des centaines d'indicateurs de chargement en CSS pur, chacun en un seul élément HTML, à copier.","en":"Hundreds of pure CSS loading indicators, each built from a single HTML element, ready to copy."}
    },
    {
      "name": "Patternpad",
      "url": "https://patternpad.com/",
      "emoji": "🔲",
      "cats": ["en-ligne","textures"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Génère des motifs géométriques à partir de formes et de couleurs réglables, à exporter en SVG, PNG ou JPG.","en":"Generates geometric patterns from adjustable shapes and colors, exported as SVG, PNG or JPG."}
    },
    {
      "name": "Can I Use",
      "url": "https://caniuse.com/",
      "emoji": "✅",
      "cats": ["web","tutos"],
      "license": "outil",
      "licenseName": "CC BY 4.0 (data)",
      "account": false,
      "desc": {"fr":"Tableaux de compatibilité des fonctions HTML, CSS et JS selon les navigateurs ; données ouvertes en CC BY 4.0.","en":"Browser support tables for HTML, CSS and JS features; the data is open under CC BY 4.0."}
    },
    {
      "name": "Saint11 — Pixel Art Tutorials",
      "url": "https://saint11.art/blog/pixel-art-tutorials/",
      "emoji": "🎓",
      "cats": ["tutos","jeux"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Courts tutoriels animés de pixel art par Pedro Medeiros (Celeste) : lumière, animation, couleurs.","en":"Short animated pixel art tutorials by Pedro Medeiros (Celeste): lighting, animation, color."}
    },
    {
      "name": "Sharpen Design",
      "url": "https://sharpen.design/",
      "emoji": "⚔️",
      "cats": ["tutos","en-ligne"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Tire au sort des sujets d'exercice de design (logo, app, site) pour s'entraîner sur des cas variés.","en":"Draws random design practice briefs (logo, app, website) so you can train on varied cases."}
    },
    {
      "name": "Same Energy",
      "url": "https://same.energy/",
      "emoji": "✨",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Moteur de recherche visuel qui trouve des images à l'ambiance proche ; pour l'inspiration, images à leurs auteurs.","en":"Visual search engine that finds images with a similar mood; for inspiration, images belong to their authors."}
    },
    {
      "name": "Abduzeedo",
      "url": "https://abduzeedo.com/",
      "emoji": "📰",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Blog de design graphique qui présente des projets de branding, d'illustration et d'interface du monde entier.","en":"Graphic design blog featuring branding, illustration and interface projects from around the world."}
    },
    {
      "name": "Lapa Ninja",
      "url": "https://www.lapa.ninja/",
      "emoji": "🥷",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Galerie de landing pages classées par catégorie pour trouver des idées de mise en page web.","en":"Gallery of landing pages sorted by category, for web layout ideas."}
    },
    {
      "name": "Savee",
      "url": "https://savee.it/",
      "emoji": "📌",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": true,
      "desc": {"fr":"Favoris visuels pour enregistrer et classer des références graphiques ; compte requis, images à leurs auteurs.","en":"Visual bookmarking to save and sort design references; account required, images belong to their authors."}
    },
    {
      "name": "ArtStation",
      "url": "https://www.artstation.com/",
      "emoji": "🎨",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Portfolios d'artistes 2D et 3D du jeu vidéo et du cinéma, à consulter ; les œuvres appartiennent aux artistes.","en":"Portfolios of 2D and 3D artists from games and film to browse; the work belongs to the artists."}
    },
    {
      "name": "Identity Designed",
      "url": "https://identitydesigned.com/",
      "emoji": "🏷️",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Études de cas d'identités visuelles par des studios du monde entier, tenues par David Airey.","en":"Case studies of visual identities by studios around the world, curated by David Airey."}
    },
    {
      "name": "Godly",
      "url": "https://godly.website/",
      "emoji": "⚡",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Sélection de sites web au design marquant, avec des aperçus vidéo de leurs animations.","en":"Curated websites with striking design, with video previews of their animations."}
    },
    {
      "name": "Land-book",
      "url": "https://land-book.com/",
      "emoji": "📖",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Galerie de landing pages et de sites, filtrables par type et par style, pour trouver des idées de mise en page.","en":"Gallery of landing pages and websites, filtered by type and style, for layout ideas."}
    },
    {
      "name": "Collect UI",
      "url": "https://collectui.com/",
      "emoji": "🗂️",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Captures d'interfaces tirées de Dribbble, classées par composant (connexion, paiement, profil...).","en":"Interface shots picked from Dribbble, sorted by component (sign-in, checkout, profile...)."}
    },
    {
      "name": "SiteInspire",
      "url": "https://www.siteinspire.com/",
      "emoji": "🌐",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Galerie de sites web choisis pour leur design, filtrables par style, type et sujet.","en":"Gallery of websites picked for their design, filtered by style, type and subject."}
    },
    {
      "name": "Kaboompics",
      "url": "https://kaboompics.com/",
      "emoji": "💥",
      "cats": ["photos"],
      "license": "pro",
      "licenseName": "Kaboompics License",
      "account": false,
      "desc": {"fr":"Photos lifestyle et intérieurs, chacune avec sa palette de couleurs ; usage commercial sans crédit.","en":"Lifestyle and interior photos, each with its color palette; commercial use without credit."}
    },
    {
      "name": "Gratisography",
      "url": "https://gratisography.com/",
      "emoji": "🎭",
      "cats": ["photos"],
      "license": "pro",
      "licenseName": "Gratisography License",
      "account": false,
      "desc": {"fr":"Photos décalées et absurdes de Ryan McGuire ; usage commercial sans crédit, revente telle quelle interdite.","en":"Quirky, offbeat photos by Ryan McGuire; commercial use without credit, no reselling as is."}
    },
    {
      "name": "New Old Stock",
      "url": "https://nos.twnsnd.co/",
      "emoji": "🕰️",
      "cats": ["photos"],
      "license": "cc0",
      "licenseName": "No known copyright restrictions",
      "account": false,
      "desc": {"fr":"Photos anciennes d'archives publiques sans restriction de copyright connue ; blog figé, vérifiez chaque source.","en":"Vintage photos from public archives with no known copyright restrictions; no longer updated, check each source."}
    },
    {
      "name": "SplitShire",
      "url": "https://www.splitshire.com",
      "emoji": "🌅",
      "cats": ["photos","footage"],
      "license": "pro",
      "licenseName": "SplitShire License",
      "account": false,
      "desc": {"fr":"Photos et vidéos gratuites d'un photographe, usage commercial sans crédit, revente telle quelle interdite.","en":"Free photos and videos by one photographer, commercial use without credit, no reselling them as is."}
    },
    {
      "name": "Negative Space",
      "url": "https://negativespace.co",
      "emoji": "⬛",
      "cats": ["photos"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Photos CC0 haute résolution (ville, tech, nature), souvent avec de l'espace libre pour placer du texte.","en":"High-resolution CC0 photos (city, tech, nature), often with empty space to place text."}
    },
    {
      "name": "Stockvault",
      "url": "https://www.stockvault.net",
      "emoji": "🗄️",
      "cats": ["photos","textures","illustrations"],
      "license": "mixte",
      "licenseName": "Commercial, Non-commercial, CC BY, CC BY-NC",
      "account": false,
      "desc": {"fr":"Photos, textures et illustrations gratuites, la licence change selon l'image : commerciale ou non.","en":"Free photos, textures and illustrations; the license changes per image, commercial or not."}
    },
    {
      "name": "Jay Mantri",
      "url": "https://jaymantri.com",
      "emoji": "🌿",
      "cats": ["photos"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Petite collection de photos CC0 de paysages et de textures naturelles, plus mise à jour depuis longtemps.","en":"Small collection of CC0 landscape and nature photos, not updated for a long time."}
    },
    {
      "name": "Morguefile",
      "url": "https://morguefile.com",
      "emoji": "🗂️",
      "cats": ["photos"],
      "license": "pro",
      "licenseName": "Morguefile License",
      "account": false,
      "desc": {"fr":"Photos gratuites pour usage commercial sans crédit, à condition de les retoucher ou les intégrer à une création.","en":"Free photos for commercial use without credit, as long as you edit them or build them into a design."}
    },
    {
      "name": "Skitterphoto",
      "url": "https://skitterphoto.com",
      "emoji": "📸",
      "cats": ["photos"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Photos CC0 de portraits, nature, architecture et scènes de ville, sans crédit à donner.","en":"CC0 photos of portraits, nature, architecture and city scenes, no credit needed."}
    },
    {
      "name": "Iwaria",
      "url": "https://iwaria.com",
      "emoji": "🌍",
      "cats": ["photos"],
      "license": "pro",
      "licenseName": "Iwaria License",
      "account": false,
      "desc": {"fr":"Photos gratuites de l'Afrique et de ses habitants (famille, travail, cuisine), usage commercial sans crédit.","en":"Free photos of Africa and African people (family, work, food), commercial use without credit."}
    },
    {
      "name": "WOCinTech Chat",
      "url": "https://www.flickr.com/photos/wocintechchat/",
      "emoji": "💻",
      "cats": ["photos"],
      "license": "credit",
      "licenseName": "CC BY 2.0",
      "account": false,
      "desc": {"fr":"Photos de femmes racisées qui travaillent dans la tech, sur Flickr, crédit « WOCinTech Chat » demandé.","en":"Photos of women of color working in tech, on Flickr, credit to \"WOCinTech Chat\" required."}
    },
    {
      "name": "Disabled And Here",
      "url": "https://affecttheverb.com/disabledandhere",
      "emoji": "♿",
      "cats": ["photos","illustrations"],
      "license": "credit",
      "licenseName": "CC BY",
      "account": false,
      "desc": {"fr":"Photos et illustrations de personnes handicapées racisées au quotidien, crédit « Disabled And Here » requis.","en":"Photos and illustrations of disabled people of color in daily life, credit to \"Disabled And Here\" required."}
    },
    {
      "name": "Use & Modify",
      "url": "https://usemodify.com",
      "emoji": "✏️",
      "cats": ["polices"],
      "license": "mixte",
      "licenseName": "SIL OFL, GPL+FE, CC BY, CC0",
      "account": false,
      "desc": {"fr":"Sélection de polices libres, surtout sous OFL, utilisables en commercial ; quelques-unes demandent un crédit.","en":"Curated free fonts, mostly under the OFL, fine for commercial use; a few ask for credit."}
    },
    {
      "name": "Indestructible Type",
      "url": "https://indestructibletype.com",
      "emoji": "💪",
      "cats": ["polices"],
      "license": "pro",
      "licenseName": "SIL OFL",
      "account": false,
      "desc": {"fr":"Fonderie indépendante d'Owen Earl : polices comme Jost et Besley, toutes sous licence OFL.","en":"Owen Earl's independent foundry: fonts such as Jost and Besley, all under the OFL."}
    },
    {
      "name": "The League of Moveable Type",
      "url": "https://www.theleagueofmoveabletype.com",
      "emoji": "🏆",
      "cats": ["polices"],
      "license": "pro",
      "licenseName": "SIL OFL",
      "account": false,
      "desc": {"fr":"Fonderie open source historique : League Gothic, League Spartan, Ostrich Sans, toutes sous OFL.","en":"Pioneering open source foundry: League Gothic, League Spartan, Ostrich Sans, all under the OFL."}
    },
    {
      "name": "Uncut.wtf",
      "url": "https://uncut.wtf",
      "emoji": "✂️",
      "cats": ["polices"],
      "license": "mixte",
      "licenseName": "SIL OFL, free licenses, personal use",
      "account": false,
      "desc": {"fr":"Catalogue de polices contemporaines gratuites (sans, serif, display, mono), licence propre à chaque police.","en":"Curated contemporary free fonts (sans, serif, display, mono), each with its own license."}
    },
    {
      "name": "Collletttivo",
      "url": "https://collletttivo.it",
      "emoji": "🔬",
      "cats": ["polices"],
      "license": "pro",
      "licenseName": "SIL OFL",
      "account": false,
      "desc": {"fr":"Collectif italien de typographie : polices expérimentales et display, toutes sous licence OFL.","en":"Italian type collective: experimental and display fonts, all under the OFL."}
    },
    {
      "name": "Tunera Type Foundry",
      "url": "https://www.tunera.xyz",
      "emoji": "🌿",
      "cats": ["polices"],
      "license": "pro",
      "licenseName": "SIL OFL",
      "account": false,
      "desc": {"fr":"Fonderie collaborative fondée à Paris, polices display originales sous licence OFL.","en":"Collaborative foundry started in Paris, original display fonts under the OFL."}
    },
    {
      "name": "Feather Icons",
      "url": "https://feathericons.com",
      "emoji": "🪶",
      "cats": ["icones"],
      "license": "pro",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Environ 280 icônes SVG au trait fin sous MIT, plus mises à jour (Lucide en est la suite active).","en":"About 280 thin-stroke SVG icons under MIT, no longer updated (Lucide is its active fork)."}
    },
    {
      "name": "Remix Icon",
      "url": "https://remixicon.com",
      "emoji": "♾️",
      "cats": ["icones"],
      "license": "pro",
      "licenseName": "Remix Icon License",
      "account": false,
      "desc": {"fr":"Plus de 3000 icônes en contour et plein, usage commercial OK, revente du pack et usage en logo interdits.","en":"Over 3,000 outline and filled icons, commercial use OK, no reselling the set or using them as logos."}
    },
    {
      "name": "Iconoir",
      "url": "https://iconoir.com",
      "emoji": "🔑",
      "cats": ["icones"],
      "license": "pro",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Plus de 1500 icônes SVG au trait régulier sous MIT, avec paquets React, Vue et Flutter.","en":"Over 1,500 consistent-stroke SVG icons under MIT, with React, Vue and Flutter packages."}
    },
    {
      "name": "Bootstrap Icons",
      "url": "https://icons.getbootstrap.com",
      "emoji": "🅱️",
      "cats": ["icones"],
      "license": "pro",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Plus de 2000 icônes SVG du projet Bootstrap sous MIT, utilisables aussi sans Bootstrap.","en":"Over 2,000 SVG icons from the Bootstrap project under MIT, usable without Bootstrap too."}
    },
    {
      "name": "Material Symbols",
      "url": "https://fonts.google.com/icons",
      "emoji": "Ⓜ️",
      "cats": ["icones"],
      "license": "pro",
      "licenseName": "Apache-2.0",
      "account": false,
      "desc": {"fr":"Icônes Google Material sous Apache 2.0, en police variable : remplissage, graisse et taille réglables.","en":"Google Material icons under Apache 2.0, as a variable font: adjustable fill, weight and size."}
    },
    {
      "name": "Octicons",
      "url": "https://primer.style/foundations/icons",
      "emoji": "🐙",
      "cats": ["icones"],
      "license": "pro",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Icônes SVG de GitHub sous MIT, dessinées pour les interfaces d'outils de développement.","en":"GitHub's SVG icons under MIT, drawn for developer tool interfaces."}
    },
    {
      "name": "Eva Icons",
      "url": "https://akveo.github.io/eva-icons/",
      "emoji": "💎",
      "cats": ["icones"],
      "license": "pro",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Plus de 480 icônes en contour et plein sous MIT, pour le web et le mobile, plus mises à jour.","en":"Over 480 outline and filled icons under MIT, for web and mobile, no longer updated."}
    },
    {
      "name": "OpenMoji",
      "url": "https://openmoji.org",
      "emoji": "😊",
      "cats": ["icones"],
      "license": "credit",
      "licenseName": "CC BY-SA 4.0",
      "account": false,
      "desc": {"fr":"Plus de 4000 emojis libres en SVG et PNG, sous CC BY-SA 4.0 : crédit et partage à l'identique.","en":"Over 4,000 free emojis in SVG and PNG, under CC BY-SA 4.0: credit and share-alike."}
    },
    {
      "name": "Fluent Emoji",
      "url": "https://github.com/microsoft/fluentui-emoji",
      "emoji": "✨",
      "cats": ["icones"],
      "license": "pro",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Emojis de Microsoft sous MIT, en styles 3D, couleur, plat et contraste élevé, sur GitHub.","en":"Microsoft's emojis under MIT, in 3D, color, flat and high-contrast styles, on GitHub."}
    },
    {
      "name": "Twemoji",
      "url": "https://github.com/jdecked/twemoji",
      "emoji": "🐦",
      "cats": ["icones"],
      "license": "credit",
      "licenseName": "CC BY 4.0",
      "account": false,
      "desc": {"fr":"Emojis de Twitter maintenus par la communauté, graphismes sous CC BY 4.0, crédit obligatoire.","en":"Twitter's emojis kept up by the community, graphics under CC BY 4.0, credit required."}
    },
    {
      "name": "IRA Design",
      "url": "https://iradesign.io",
      "emoji": "🎨",
      "cats": ["illustrations","en-ligne"],
      "license": "pro",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Illustrations en dégradés à assembler et recolorer en ligne, export SVG et PNG, sous MIT.","en":"Gradient illustrations you assemble and recolor online, SVG and PNG export, under MIT."}
    },
    {
      "name": "Illlustrations.co",
      "url": "https://illlustrations.co",
      "emoji": "🎭",
      "cats": ["illustrations"],
      "license": "pro",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Une centaine d'illustrations colorées de Vijay Verma, gratuites pour usage perso et commercial.","en":"About a hundred colorful illustrations by Vijay Verma, free for personal and commercial use."}
    },
    {
      "name": "Delesign",
      "url": "https://delesign.com/free-designs/graphics/",
      "emoji": "🎯",
      "cats": ["illustrations","icones"],
      "license": "pro",
      "licenseName": "Delesign License",
      "account": false,
      "desc": {"fr":"Illustrations et icônes SVG et PNG gratuites, couleurs modifiables, usage commercial sans crédit.","en":"Free SVG and PNG illustrations and icons with editable colors, commercial use without credit."}
    },
    {
      "name": "Pixeltrue",
      "url": "https://www.pixeltrue.com/free-illustrations",
      "emoji": "👾",
      "cats": ["illustrations","motion"],
      "license": "pro",
      "licenseName": "Pixeltrue License",
      "account": false,
      "desc": {"fr":"Illustrations gratuites, dont des animations Lottie, usage commercial sans crédit ; le reste est payant.","en":"Free illustrations, some animated in Lottie, commercial use without credit; the rest is paid."}
    },
    {
      "name": "Fresh Folk",
      "url": "https://fresh-folk.com",
      "emoji": "🌻",
      "cats": ["illustrations"],
      "license": "perso",
      "licenseName": "Personal use",
      "account": false,
      "desc": {"fr":"Personnages et objets à combiner (poses, tenues, couleurs de peau), licence à vérifier avant un projet client.","en":"Mix-and-match characters and objects (poses, outfits, skin tones), check the license before client work."}
    },
    {
      "name": "Stubborn",
      "url": "https://stubborn.fun",
      "emoji": "😤",
      "cats": ["illustrations","en-ligne"],
      "license": "perso",
      "licenseName": "Unspecified",
      "account": false,
      "desc": {"fr":"Générateur de personnages vectoriels en ligne (poses, expressions), licence non précisée sur le site.","en":"Online vector character generator (poses, expressions), the site states no clear license."}
    },
    {
      "name": "ColorSpace",
      "url": "https://mycolor.space",
      "emoji": "🌈",
      "cats": ["couleurs","en-ligne"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Génère des palettes et des dégradés à partir d'une ou deux couleurs de départ, sans compte.","en":"Generates palettes and gradients from one or two starting colors, no account needed."}
    },
    {
      "name": "Happy Hues",
      "url": "https://www.happyhues.co",
      "emoji": "😊",
      "cats": ["couleurs","inspi"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Palettes choisies à la main, montrées directement sur une page web pour juger le rendu.","en":"Hand-picked palettes shown live on a web page so you can judge how they look."}
    },
    {
      "name": "shadcn/ui",
      "url": "https://ui.shadcn.com",
      "emoji": "🧩",
      "cats": ["web"],
      "license": "opensource",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Composants React accessibles à copier dans son projet, stylés avec Tailwind CSS, sous MIT.","en":"Accessible React components you copy into your project, styled with Tailwind CSS, under MIT."}
    },
    {
      "name": "Audacity",
      "url": "https://www.audacityteam.org",
      "emoji": "🎤",
      "cats": ["logiciels","effets"],
      "license": "opensource",
      "licenseName": "GPL-3.0",
      "account": false,
      "desc": {"fr":"Éditeur audio multipiste libre pour Windows, Mac et Linux : couper, nettoyer, mixer des sons.","en":"Free multitrack audio editor for Windows, Mac and Linux: cut, clean up and mix sounds."}
    },
    {
      "name": "Transparent Textures",
      "url": "https://www.transparenttextures.com",
      "emoji": "🔳",
      "cats": ["textures","web"],
      "license": "mixte",
      "licenseName": "CC BY-SA 3.0, free licenses",
      "account": false,
      "desc": {"fr":"Motifs PNG transparents à recolorer pour fonds web, licence et crédit selon l'auteur du motif.","en":"Transparent PNG patterns you recolor for web backgrounds, license and credit depend on each author."}
    },
    {
      "name": "Subtle Patterns",
      "url": "https://www.toptal.com/designers/subtlepatterns/",
      "emoji": "🌫️",
      "cats": ["textures","web"],
      "license": "credit",
      "licenseName": "CC BY-SA 3.0",
      "account": false,
      "desc": {"fr":"Motifs de fond discrets et répétables pour le web, sous CC BY-SA 3.0 : crédit et partage à l'identique.","en":"Subtle repeating background patterns for the web, under CC BY-SA 3.0: credit and share-alike."}
    },
    {
      "name": "Lost and Taken",
      "url": "https://lostandtaken.com",
      "emoji": "🌿",
      "cats": ["textures"],
      "license": "pro",
      "licenseName": "Lost & Taken License",
      "account": false,
      "desc": {"fr":"Textures haute résolution gratuites (papier, grunge, vintage, pellicule), crédit apprécié mais pas requis.","en":"Free high-resolution textures (paper, grunge, vintage, film), credit welcome but not required."}
    },
    {
      "name": "OBS Studio",
      "url": "https://obsproject.com",
      "emoji": "🎥",
      "cats": ["logiciels","footage"],
      "license": "opensource",
      "licenseName": "GPL-2.0",
      "account": false,
      "desc": {"fr":"Logiciel libre pour enregistrer son écran ou sa caméra et diffuser en direct, sur Windows, Mac et Linux.","en":"Open source app to record your screen or camera and stream live, on Windows, Mac and Linux."}
    },
    {
      "name": "Ezgif",
      "url": "https://ezgif.com",
      "emoji": "🎞️",
      "cats": ["en-ligne","motion"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Crée, recadre, compresse et convertit des GIF et courtes vidéos dans le navigateur, sans compte.","en":"Make, crop, compress and convert GIFs and short videos in the browser, no account needed."}
    },
    {
      "name": "UI Avatars",
      "url": "https://ui-avatars.com",
      "emoji": "👤",
      "cats": ["en-ligne","web"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Avatars à initiales générés par une simple URL, avec couleurs et taille réglables, pour les prototypes.","en":"Initials avatars generated from a plain URL, with adjustable colors and size, for prototypes."}
    },
    {
      "name": "DiceBear",
      "url": "https://www.dicebear.com",
      "emoji": "🎲",
      "cats": ["en-ligne","web","icones"],
      "license": "mixte",
      "licenseName": "MIT, CC0, CC BY 4.0",
      "account": false,
      "desc": {"fr":"Générateur d'avatars SVG open source aux dizaines de styles ; licence selon le style (CC0 ou CC BY).","en":"Open source SVG avatar generator with dozens of styles; the license depends on the style (CC0 or CC BY)."}
    },
    {
      "name": "Lorem Picsum",
      "url": "https://picsum.photos",
      "emoji": "🖼️",
      "cats": ["web"],
      "license": "opensource",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Service open source d'images de remplissage : une URL avec la taille voulue renvoie une photo.","en":"Open source placeholder image service: a URL with the size you want returns a photo."}
    },
    {
      "name": "HandBrake",
      "url": "https://handbrake.fr",
      "emoji": "🖐️",
      "cats": ["logiciels","footage"],
      "license": "opensource",
      "licenseName": "GPL-2.0",
      "account": false,
      "desc": {"fr":"Logiciel open source pour convertir et compresser des vidéos, sur Windows, macOS et Linux.","en":"Open source app to convert and compress videos, on Windows, macOS and Linux."}
    },
    {
      "name": "uiGradients",
      "url": "https://uigradients.com",
      "emoji": "🌈",
      "cats": ["couleurs","web"],
      "license": "opensource",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Collection open source de dégradés à deux ou trois couleurs, avec le code CSS à copier.","en":"Open source collection of two- and three-color gradients, with the CSS code to copy."}
    },
    {
      "name": "WebGradients",
      "url": "https://webgradients.com",
      "emoji": "🎨",
      "cats": ["couleurs","web"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Collection de dégradés linéaires avec leur code CSS à copier, sans crédit demandé.","en":"Collection of linear gradients with their CSS code to copy, no credit asked."}
    },
    {
      "name": "Blobmaker",
      "url": "https://www.blobmaker.app",
      "emoji": "🫧",
      "cats": ["en-ligne","web"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Générateur de formes organiques (blobs) au hasard, à régler puis télécharger en SVG.","en":"Generator of random organic shapes (blobs) you tweak and download as SVG."}
    },
    {
      "name": "Shape Divider",
      "url": "https://www.shapedivider.app",
      "emoji": "📐",
      "cats": ["en-ligne","web"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Générateur de séparateurs de sections pour pages web (vagues, pentes), exportés en SVG ou CSS.","en":"Generator of section dividers for web pages (waves, slopes), exported as SVG or CSS."}
    },
    {
      "name": "fffuel",
      "url": "https://fffuel.co",
      "emoji": "⚡",
      "cats": ["en-ligne","web","textures"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Suite de générateurs SVG (dégradés, grain, motifs, flèches, confettis), usage commercial permis.","en":"Suite of SVG generators (gradients, grain, patterns, arrows, confetti), commercial use allowed."}
    },
    {
      "name": "Get Waves",
      "url": "https://getwaves.io",
      "emoji": "🌊",
      "cats": ["en-ligne","web"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Générateur de vagues SVG à régler (hauteur, nombre de pics) pour fonds et transitions web.","en":"Generator of SVG waves you tweak (height, number of peaks) for web backgrounds and transitions."}
    },
    {
      "name": "Smooth Shadow",
      "url": "https://shadows.brumm.af",
      "emoji": "🌑",
      "cats": ["en-ligne","web"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Générateur d'ombres CSS en plusieurs couches pour un rendu doux, avec aperçu en direct.","en":"Generator of layered CSS shadows for a soft look, with a live preview."}
    },
    {
      "name": "CSS-Tricks",
      "url": "https://css-tricks.com",
      "emoji": "🎩",
      "cats": ["tutos","web"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Articles et guides sur CSS, HTML et JavaScript ; les extraits de code sont libres d'usage.","en":"Articles and guides on CSS, HTML and JavaScript; the code snippets are free to use."}
    },
    {
      "name": "Codrops",
      "url": "https://tympanus.net/codrops",
      "emoji": "💧",
      "cats": ["tutos","web","inspi"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Tutoriels et démos web créatives (CSS, WebGL, Three.js, GSAP), code utilisable en projet.","en":"Creative web tutorials and demos (CSS, WebGL, Three.js, GSAP), code usable in projects."}
    },
    {
      "name": "freeCodeCamp",
      "url": "https://www.freecodecamp.org",
      "emoji": "🔥",
      "cats": ["tutos","web"],
      "license": "outil",
      "licenseName": "BSD-3-Clause",
      "account": false,
      "desc": {"fr":"Cours de développement web gratuits ; un compte sert seulement à garder sa progression.","en":"Free web development courses; an account is only needed to save your progress."}
    },
    {
      "name": "Spoon Graphics",
      "url": "https://blog.spoongraphics.co.uk",
      "emoji": "🥄",
      "cats": ["tutos","textures","brushes"],
      "license": "pro",
      "licenseName": "Spoon Graphics License",
      "account": false,
      "desc": {"fr":"Tutoriels Illustrator et Photoshop, plus textures et brushes gratuits utilisables en pro.","en":"Illustrator and Photoshop tutorials, plus free textures and brushes usable in client work."}
    },
    {
      "name": "Motion Café",
      "url": "https://www.motion-cafe.com",
      "emoji": "☕",
      "cats": ["tutos","motion"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Tutoriels en français sur After Effects et le motion design, avec fichiers projet à télécharger.","en":"French-language After Effects and motion design tutorials, with project files to download."}
    },
    {
      "name": "Muzli",
      "url": "https://muz.li",
      "emoji": "🎵",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Fil d'inspiration design et extension navigateur ; les œuvres montrées restent à leurs auteurs.","en":"Design inspiration feed and browser extension; the works shown belong to their authors."}
    },
    {
      "name": "UI Movement",
      "url": "https://uimovement.com",
      "emoji": "🔄",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Galerie d'animations et d'interactions d'interface envoyées par des designers, classées par élément.","en":"Gallery of interface animations and interactions sent in by designers, sorted by element."}
    },
    {
      "name": "Designspiration",
      "url": "https://www.designspiration.com",
      "emoji": "🔍",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Moteur de recherche d'images d'inspiration (graphisme, branding), filtrable par couleur.","en":"Search engine for inspiration images (graphic design, branding), filterable by color."}
    },
    {
      "name": "Httpster",
      "url": "https://httpster.net",
      "emoji": "🌐",
      "cats": ["inspi","web"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Galerie de sites web au design marqué, classés par type et par style.","en":"Gallery of websites with strong design, sorted by type and style."}
    },
    {
      "name": "ActionVFX Free",
      "url": "https://www.actionvfx.com/collections/free-vfx",
      "emoji": "💥",
      "cats": ["motion"],
      "license": "pro",
      "licenseName": "ActionVFX License",
      "account": true,
      "desc": {"fr":"Éléments VFX gratuits (feu, fumée, explosions) utilisables en pro ; compte gratuit requis.","en":"Free VFX elements (fire, smoke, explosions) usable in client work; free account required."}
    },
    {
      "name": "FreshLUTs",
      "url": "https://freshluts.com",
      "emoji": "🎨",
      "cats": ["motion"],
      "license": "mixte",
      "licenseName": "Custom (per LUT)",
      "account": false,
      "desc": {"fr":"LUTs d'étalonnage partagées par la communauté ; licence fixée par chaque auteur, à vérifier.","en":"Color grading LUTs shared by the community; each author sets the license, check it."}
    },
    {
      "name": "Life of Vids",
      "url": "https://www.lifeofvids.com",
      "emoji": "🎬",
      "cats": ["footage"],
      "license": "pro",
      "licenseName": "Life of Vids License",
      "account": false,
      "desc": {"fr":"Clips vidéo gratuits sans restriction de droits, usage commercial sans crédit ; peu de nouveautés.","en":"Free video clips with no copyright restrictions, commercial use without credit; rarely updated."}
    },
    {
      "name": "Dareful",
      "url": "https://dareful.com",
      "emoji": "🌅",
      "cats": ["footage"],
      "license": "credit",
      "licenseName": "CC BY 4.0",
      "account": true,
      "desc": {"fr":"Vidéos 4K de paysages et vues aériennes sous CC BY 4.0 : crédit demandé, compte requis.","en":"4K videos of landscapes and aerial shots under CC BY 4.0: credit required, account needed."}
    },
    {
      "name": "Blend Swap",
      "url": "https://www.blendswap.com",
      "emoji": "🔀",
      "cats": ["3d","jeux"],
      "license": "mixte",
      "licenseName": "CC0, CC BY, CC BY-SA, CC BY-NC",
      "account": true,
      "desc": {"fr":"Modèles Blender partagés par la communauté ; licence selon le modèle, compte gratuit requis.","en":"Blender models shared by the community; license varies per model, free account required."}
    },
    {
      "name": "Wikimedia Commons",
      "url": "https://commons.wikimedia.org",
      "emoji": "📚",
      "cats": ["photos","illustrations","footage"],
      "license": "mixte",
      "licenseName": "Public domain, CC0, CC BY, CC BY-SA",
      "account": false,
      "desc": {"fr":"Médiathèque libre d'images, vidéos et sons ; crédit souvent demandé, licence à lire par fichier.","en":"Free media library of images, videos and sounds; credit often required, check each file's license."}
    },
    {
      "name": "NASA Image Library",
      "url": "https://images.nasa.gov",
      "emoji": "🚀",
      "cats": ["photos","footage","effets"],
      "license": "cc0",
      "licenseName": "Public domain",
      "account": false,
      "desc": {"fr":"Images, vidéos et sons de la NASA, domaine public ; logos NASA exclus, pas d'aval sous-entendu.","en":"NASA images, videos and sounds in the public domain; NASA logos excluded, no implied endorsement."}
    },
    {
      "name": "The Met Open Access",
      "url": "https://www.metmuseum.org/art/collection/search?showOnly=openAccess",
      "emoji": "🖼️",
      "cats": ["photos","illustrations","inspi"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Images en CC0 des œuvres du domaine public du Metropolitan Museum : peintures, gravures, objets.","en":"CC0 images of the Metropolitan Museum's public domain works: paintings, prints, objects."}
    },
    {
      "name": "Smithsonian Open Access",
      "url": "https://www.si.edu/openaccess",
      "emoji": "🏛️",
      "cats": ["photos","illustrations","3d"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Images et modèles 3D des musées Smithsonian en CC0 : art, sciences, histoire.","en":"Images and 3D models from the Smithsonian museums under CC0: art, science, history."}
    },
    {
      "name": "The Public Domain Review",
      "url": "https://publicdomainreview.org",
      "emoji": "📜",
      "cats": ["illustrations","inspi"],
      "license": "cc0",
      "licenseName": "Public domain",
      "account": false,
      "desc": {"fr":"Sélection commentée d'œuvres du domaine public : gravures, illustrations anciennes, photos d'époque.","en":"Curated public domain works with essays: engravings, old illustrations, historic photos."}
    },
    {
      "name": "Pixelorama",
      "url": "https://orama-interactive.itch.io/pixelorama",
      "emoji": "🎨",
      "cats": ["logiciels","jeux"],
      "license": "opensource",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Éditeur open source de pixel art et d'animation, fait avec Godot, sur ordinateur ou navigateur.","en":"Open source pixel art and animation editor built with Godot, for desktop or browser."}
    },
    {
      "name": "Excalidraw",
      "url": "https://excalidraw.com",
      "emoji": "✏️",
      "cats": ["en-ligne"],
      "license": "opensource",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Tableau blanc open source au rendu dessiné à la main pour schémas et croquis, sans compte.","en":"Open source whiteboard with a hand-drawn look for diagrams and sketches, no account needed."}
    },
    {
      "name": "draw.io",
      "url": "https://www.drawio.com",
      "emoji": "📊",
      "cats": ["en-ligne","logiciels"],
      "license": "opensource",
      "licenseName": "Apache-2.0",
      "account": false,
      "desc": {"fr":"Éditeur open source de diagrammes et wireframes, en ligne ou sur ordinateur, fichiers gardés chez toi.","en":"Open source diagram and wireframe editor, online or desktop, files saved where you choose."}
    },
    {
      "name": "tldraw",
      "url": "https://www.tldraw.com",
      "emoji": "🖍️",
      "cats": ["en-ligne"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Tableau blanc en ligne gratuit pour croquis et schémas ; compte seulement pour sauver en ligne.","en":"Free online whiteboard for sketches and diagrams; an account is only needed to save online."}
    },
    {
      "name": "MDN Web Docs",
      "url": "https://developer.mozilla.org",
      "emoji": "📖",
      "cats": ["tutos","web"],
      "license": "outil",
      "licenseName": "CC BY-SA 2.5, CC0",
      "account": false,
      "desc": {"fr":"Documentation de référence de Mozilla sur HTML, CSS et JavaScript ; exemples de code en CC0.","en":"Mozilla's reference documentation on HTML, CSS and JavaScript; code examples under CC0."}
    },
    {
      "name": "Devicon",
      "url": "https://devicon.dev",
      "emoji": "💻",
      "cats": ["icones","web"],
      "license": "pro",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Icônes des langages et outils de développement (MIT) ; les logos restent des marques déposées.","en":"Icons for programming languages and dev tools (MIT); the logos remain trademarks."}
    },
    {
      "name": "Tailwind CSS",
      "url": "https://tailwindcss.com",
      "emoji": "🌬️",
      "cats": ["web"],
      "license": "opensource",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Framework CSS open source à classes utilitaires, avec documentation et éditeur en ligne gratuits.","en":"Open source utility-first CSS framework, with free documentation and online playground."}
    },
    {
      "name": "Open Props",
      "url": "https://open-props.style",
      "emoji": "🎚️",
      "cats": ["web","couleurs"],
      "license": "opensource",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Bibliothèque open source de variables CSS : couleurs, tailles, ombres, dégradés, animations.","en":"Open source library of CSS variables: colors, sizes, shadows, gradients, animations."}
    },
    {
      "name": "Sonniss GameAudioGDC",
      "url": "https://sonniss.com/gameaudiogdc",
      "emoji": "🔊",
      "cats": ["effets","jeux"],
      "license": "pro",
      "licenseName": "Sonniss GDC License",
      "account": false,
      "desc": {"fr":"Packs annuels de plusieurs Go d'effets sonores, usage commercial sans crédit, revente interdite.","en":"Yearly multi-GB sound effect bundles, commercial use without credit, no reselling the sounds."}
    },
    {
      "name": "Blender",
      "url": "https://www.blender.org/",
      "emoji": "🧊",
      "cats": ["logiciels","3d","motion"],
      "license": "opensource",
      "licenseName": "GPL",
      "account": false,
      "desc": {"fr":"Logiciel 3D complet : modélisation, sculpture, animation, rendu, montage et compositing.","en":"Full 3D suite: modeling, sculpting, animation, rendering, video editing and compositing."}
    },
    {
      "name": "DaVinci Resolve",
      "url": "https://www.blackmagicdesign.com/products/davinciresolve",
      "emoji": "🎬",
      "cats": ["logiciels","motion"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Montage, étalonnage, effets et son, sans filigrane. Export limité à l'UHD 60 i/s.","en":"Editing, color grading, effects and audio with no watermark. Export capped at UHD 60 fps."}
    },
    {
      "name": "Kdenlive",
      "url": "https://kdenlive.org/",
      "emoji": "🎞",
      "cats": ["logiciels","motion"],
      "license": "opensource",
      "licenseName": "GPL-3.0",
      "account": false,
      "desc": {"fr":"Logiciel de montage vidéo multipiste de KDE, pour Windows, macOS et Linux.","en":"Multitrack video editor from KDE, for Windows, macOS and Linux."}
    },
    {
      "name": "Shotcut",
      "url": "https://shotcut.org/",
      "emoji": "✂",
      "cats": ["logiciels","motion"],
      "license": "opensource",
      "licenseName": "GPL-3.0",
      "account": false,
      "desc": {"fr":"Logiciel de montage vidéo multiplateforme, qui lit la plupart des formats sans conversion.","en":"Cross-platform video editor that opens most formats without converting them first."}
    },
    {
      "name": "Synfig Studio",
      "url": "https://www.synfig.org/",
      "emoji": "🦋",
      "cats": ["logiciels","motion"],
      "license": "opensource",
      "licenseName": "GPL-3.0",
      "account": false,
      "desc": {"fr":"Animation 2D vectorielle avec interpolation automatique entre les images clés et squelettes.","en":"2D vector animation with automatic tweening between keyframes and bone rigging."}
    },
    {
      "name": "OpenToonz",
      "url": "https://opentoonz.github.io/e/",
      "emoji": "🖍",
      "cats": ["logiciels","motion"],
      "license": "opensource",
      "licenseName": "BSD-3-Clause",
      "account": false,
      "desc": {"fr":"Logiciel d'animation 2D dérivé de Toonz, utilisé par le studio Ghibli, avec ses outils de scan.","en":"2D animation software based on Toonz, used by Studio Ghibli, with its scanning tools."}
    },
    {
      "name": "Pencil2D",
      "url": "https://www.pencil2d.org/",
      "emoji": "✏",
      "cats": ["logiciels","motion"],
      "license": "opensource",
      "licenseName": "GPL-2.0",
      "account": false,
      "desc": {"fr":"Animation 2D image par image, en dessin bitmap ou vectoriel, simple à prendre en main.","en":"Frame-by-frame 2D animation in bitmap or vector drawing, easy to pick up."}
    },
    {
      "name": "lottie-web",
      "url": "https://github.com/airbnb/lottie-web",
      "emoji": "🧩",
      "cats": ["web","motion"],
      "license": "opensource",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Bibliothèque JavaScript qui lit sur le web les animations After Effects exportées en JSON.","en":"JavaScript library that plays After Effects animations exported as JSON on the web."}
    },
    {
      "name": "LottieFiles",
      "url": "https://lottiefiles.com/free-animations",
      "emoji": "🎈",
      "cats": ["motion","web"],
      "license": "pro",
      "licenseName": "Lottie Simple License",
      "account": true,
      "desc": {"fr":"Animations Lottie gratuites, usage commercial sans crédit. Revente des fichiers seuls interdite.","en":"Free Lottie animations, commercial use without credit. Reselling the files as is is not allowed."}
    },
    {
      "name": "Mixamo",
      "url": "https://www.mixamo.com/",
      "emoji": "🕺",
      "cats": ["3d","jeux"],
      "license": "pro",
      "licenseName": "Adobe ToS",
      "account": true,
      "desc": {"fr":"Personnages 3D et animations, avec rigging automatique. Compte Adobe gratuit obligatoire.","en":"3D characters and animations with automatic rigging. A free Adobe account is required."}
    },
    {
      "name": "Poly Pizza",
      "url": "https://poly.pizza/",
      "emoji": "🍕",
      "cats": ["3d","jeux"],
      "license": "mixte",
      "licenseName": "CC0 / CC BY",
      "account": false,
      "desc": {"fr":"Plus de 10 000 modèles 3D low poly en GLB et OBJ, sous CC0 ou CC BY selon le modèle.","en":"Over 10,000 low-poly 3D models in GLB and OBJ, under CC0 or CC BY depending on the model."}
    },
    {
      "name": "KayKit",
      "url": "https://kaylousberg.itch.io/",
      "emoji": "🏰",
      "cats": ["jeux","3d"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Packs de modèles 3D low poly pour jeux, sous CC0, à prix libre avec téléchargement gratuit.","en":"Low-poly 3D model packs for games under CC0, pay what you want with a free download."}
    },
    {
      "name": "Game-icons.net",
      "url": "https://game-icons.net/",
      "emoji": "⚔",
      "cats": ["icones","jeux"],
      "license": "credit",
      "licenseName": "CC BY 3.0",
      "account": false,
      "desc": {"fr":"Plus de 4 000 icônes de jeu en SVG et PNG, personnalisables en ligne. Crédit de l'auteur requis.","en":"Over 4,000 game icons in SVG and PNG, customizable online. Credit to the author is required."}
    },
    {
      "name": "Lospec",
      "url": "https://lospec.com/palette-list",
      "emoji": "👾",
      "cats": ["couleurs","jeux"],
      "license": "outil",
      "licenseName": "Free",
      "account": false,
      "desc": {"fr":"Base de palettes pour le pixel art, avec tags, nombre de couleurs et export pour les logiciels.","en":"Database of pixel art palettes, with tags, color counts and exports for drawing apps."}
    },
    {
      "name": "LDtk",
      "url": "https://ldtk.io/",
      "emoji": "🗺",
      "cats": ["jeux","logiciels"],
      "license": "opensource",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Éditeur de niveaux 2D pour jeux, par un développeur de Dead Cells, avec export JSON.","en":"2D level editor for games, made by a Dead Cells developer, with JSON export."}
    },
    {
      "name": "Godot Engine",
      "url": "https://godotengine.org/",
      "emoji": "🤖",
      "cats": ["jeux","logiciels"],
      "license": "opensource",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Moteur de jeu 2D et 3D, sans redevance : les jeux créés appartiennent à leur auteur.","en":"2D and 3D game engine with no royalties: the games you make belong to you."}
    },
    {
      "name": "LMMS",
      "url": "https://lmms.io/",
      "emoji": "🎹",
      "cats": ["logiciels","musique"],
      "license": "opensource",
      "licenseName": "GPL-2.0",
      "account": false,
      "desc": {"fr":"Logiciel de composition musicale avec séquenceur, synthés intégrés et prise en charge VST.","en":"Music production software with a sequencer, built-in synths and VST support."}
    },
    {
      "name": "jsfxr",
      "url": "https://sfxr.me/",
      "emoji": "💥",
      "cats": ["effets","jeux"],
      "license": "opensource",
      "licenseName": "Unlicense",
      "account": false,
      "desc": {"fr":"Générateur en ligne de bruitages rétro pour jeux (sauts, tirs, pièces), export en WAV.","en":"Online generator of retro game sound effects (jumps, shots, coins), with WAV export."}
    },
    {
      "name": "ChipTone",
      "url": "https://sfbgames.itch.io/chiptone",
      "emoji": "🕹",
      "cats": ["effets","jeux"],
      "license": "outil",
      "licenseName": "Freeware",
      "account": false,
      "desc": {"fr":"Outil en ligne de bruitages rétro. Les sons créés sont sous CC0, usage commercial sans crédit.","en":"Online retro sound effects tool. Sounds you make are CC0, commercial use without credit."}
    },
    {
      "name": "Soundimage.org",
      "url": "https://soundimage.org/",
      "emoji": "🎼",
      "cats": ["musique","effets"],
      "license": "credit",
      "licenseName": "Custom",
      "account": false,
      "desc": {"fr":"Milliers de musiques et ambiances d'Eric Matyas, usage commercial avec crédit obligatoire.","en":"Thousands of music tracks and soundscapes by Eric Matyas, commercial use with credit required."}
    },
    {
      "name": "BBC Sound Effects",
      "url": "https://sound-effects.bbcrewind.co.uk/",
      "emoji": "📻",
      "cats": ["effets"],
      "license": "perso",
      "licenseName": "RemArc",
      "account": false,
      "desc": {"fr":"Plus de 33 000 bruitages des archives de la BBC, gratuits pour un usage perso ou éducatif.","en":"Over 33,000 sound effects from the BBC archive, free for personal or educational use."}
    },
    {
      "name": "Prelinger Archives",
      "url": "https://archive.org/details/prelinger",
      "emoji": "📽",
      "cats": ["footage"],
      "license": "mixte",
      "licenseName": "Public domain / CC",
      "account": false,
      "desc": {"fr":"Milliers de films publicitaires, éducatifs et industriels, en majorité dans le domaine public.","en":"Thousands of advertising, educational and industrial films, mostly in the public domain."}
    },
    {
      "name": "ESA/Hubble",
      "url": "https://esahubble.org/images/",
      "emoji": "🔭",
      "cats": ["photos","footage"],
      "license": "credit",
      "licenseName": "CC BY 4.0",
      "account": false,
      "desc": {"fr":"Images et vidéos du télescope Hubble, avec le crédit « ESA/Hubble » obligatoire.","en":"Images and videos from the Hubble telescope, with the credit \"ESA/Hubble\" required."}
    },
    {
      "name": "GSAP",
      "url": "https://gsap.com/",
      "emoji": "🚀",
      "cats": ["web","motion"],
      "license": "outil",
      "licenseName": "GSAP Standard License",
      "account": false,
      "desc": {"fr":"Bibliothèque JavaScript d'animation, plugins compris. Interdite dans un outil concurrent de Webflow.","en":"JavaScript animation library, plugins included. Not allowed in a tool competing with Webflow."}
    },
    {
      "name": "Anime.js",
      "url": "https://animejs.com/",
      "emoji": "🎢",
      "cats": ["web","motion"],
      "license": "opensource",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Bibliothèque JavaScript légère pour animer CSS, SVG, attributs DOM et objets JS.","en":"Lightweight JavaScript library to animate CSS, SVG, DOM attributes and JS objects."}
    },
    {
      "name": "p5.js",
      "url": "https://p5js.org/",
      "emoji": "🖌",
      "cats": ["web","tutos"],
      "license": "opensource",
      "licenseName": "LGPL-2.1",
      "account": false,
      "desc": {"fr":"Bibliothèque JavaScript de code créatif pour dessiner et animer dans le navigateur, avec tutos.","en":"Creative coding JavaScript library to draw and animate in the browser, with tutorials."}
    },
    {
      "name": "Uiverse",
      "url": "https://uiverse.io/",
      "emoji": "🌌",
      "cats": ["web"],
      "license": "pro",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Plus de 3 000 éléments d'interface en HTML et CSS (boutons, loaders, cartes), à copier.","en":"Over 3,000 UI elements in HTML and CSS (buttons, loaders, cards) to copy and paste."}
    },
    {
      "name": "SVGOMG",
      "url": "https://jakearchibald.github.io/svgomg/",
      "emoji": "🗜",
      "cats": ["en-ligne","web"],
      "license": "opensource",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Optimise et allège les fichiers SVG dans le navigateur, avec aperçu avant et après.","en":"Optimizes and shrinks SVG files in the browser, with a before and after preview."}
    },
    {
      "name": "Laws of UX",
      "url": "https://lawsofux.com/",
      "emoji": "⚖",
      "cats": ["tutos"],
      "license": "perso",
      "licenseName": "CC BY-NC-ND 4.0",
      "account": false,
      "desc": {"fr":"Les grands principes de psychologie appliqués à l'UX, expliqués en une page chacun.","en":"Key psychology principles applied to UX, each explained on its own page."}
    },
    {
      "name": "web.dev Learn",
      "url": "https://web.dev/learn",
      "emoji": "📘",
      "cats": ["tutos","web"],
      "license": "credit",
      "licenseName": "CC BY 4.0",
      "account": false,
      "desc": {"fr":"Cours gratuits de Google sur le CSS, le design web, l'accessibilité et les images.","en":"Free courses from Google on CSS, web design, accessibility and images."}
    },
    {
      "name": "The Book of Shaders",
      "url": "https://thebookofshaders.com/",
      "emoji": "📙",
      "cats": ["tutos","web"],
      "license": "outil",
      "licenseName": "Free",
      "account": false,
      "desc": {"fr":"Guide pas à pas des fragment shaders GLSL, avec des exemples modifiables dans la page.","en":"Step-by-step guide to GLSL fragment shaders, with examples you can edit on the page."}
    },
    {
      "name": "Openverse",
      "url": "https://openverse.org/",
      "emoji": "🔍",
      "cats": ["photos","illustrations","effets"],
      "license": "mixte",
      "licenseName": "CC / PD",
      "account": false,
      "desc": {"fr":"Moteur de recherche d'images et de sons sous licence Creative Commons, avec filtre usage commercial.","en":"Search engine for Creative Commons and public domain images and audio, with a commercial-use filter."}
    },
    {
      "name": "Flickr Commons",
      "url": "https://www.flickr.com/commons",
      "emoji": "📷",
      "cats": ["photos"],
      "license": "cc0",
      "licenseName": "No known restrictions",
      "account": false,
      "desc": {"fr":"Photos d'archives de musées et bibliothèques publiées sans restriction de droit d'auteur connue.","en":"Archive photos from museums and libraries, published with no known copyright restrictions."}
    },
    {
      "name": "Library of Congress — Free to Use and Reuse",
      "url": "https://www.loc.gov/free-to-use/",
      "emoji": "🏛️",
      "cats": ["photos","illustrations"],
      "license": "cc0",
      "licenseName": "Public domain",
      "account": false,
      "desc": {"fr":"Affiches, cartes, photos et estampes de la Bibliothèque du Congrès, libres de réutilisation.","en":"Posters, maps, photos and prints from the Library of Congress, free to use and reuse."}
    },
    {
      "name": "Art Institute of Chicago — Open Access",
      "url": "https://www.artic.edu/collection?is_public_domain=1",
      "emoji": "🖼️",
      "cats": ["illustrations"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Œuvres du domaine public de l'Art Institute of Chicago en haute définition, sous CC0.","en":"Public domain artworks from the Art Institute of Chicago in high resolution, under CC0."}
    },
    {
      "name": "Rijksmuseum — Collection",
      "url": "https://www.rijksmuseum.nl/en/collection",
      "emoji": "🎨",
      "cats": ["illustrations"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Peintures, gravures et objets du Rijksmuseum du domaine public, téléchargeables en haute définition.","en":"Public domain paintings, prints and objects from the Rijksmuseum, downloadable in high resolution."}
    },
    {
      "name": "Paris Musées Collections",
      "url": "https://www.parismuseescollections.paris.fr/",
      "emoji": "🗼",
      "cats": ["illustrations","photos"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Œuvres des musées de la Ville de Paris en CC0 ; seules les œuvres du domaine public sont en haute définition.","en":"Works from the Paris city museums under CC0; only public domain works come in high resolution."}
    },
    {
      "name": "Cleveland Museum of Art — Open Access",
      "url": "https://www.clevelandart.org/open-access",
      "emoji": "🏺",
      "cats": ["illustrations","3d"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Œuvres du domaine public du musée de Cleveland en CC0, images et modèles 3D compris.","en":"Public domain works from the Cleveland Museum of Art under CC0, including images and 3D models."}
    },
    {
      "name": "Old Book Illustrations",
      "url": "https://www.oldbookillustrations.com/",
      "emoji": "📚",
      "cats": ["illustrations"],
      "license": "cc0",
      "licenseName": "Public domain",
      "account": false,
      "desc": {"fr":"Gravures de livres anciens du domaine public, bien numérisées et classées par artiste et thème.","en":"Public domain engravings from old books, cleanly scanned and sorted by artist and subject."}
    },
    {
      "name": "Public Domain Vectors",
      "url": "https://publicdomainvectors.org/",
      "emoji": "✏️",
      "cats": ["illustrations"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Cliparts vectoriels envoyés par la communauté et placés dans le domaine public (CC0).","en":"Community-made vector cliparts released into the public domain (CC0)."}
    },
    {
      "name": "FreeSVG",
      "url": "https://freesvg.org/",
      "emoji": "📐",
      "cats": ["illustrations"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Images SVG du domaine public, téléchargeables aussi en PNG, sans compte.","en":"Public domain SVG images, also downloadable as PNG, no account needed."}
    },
    {
      "name": "Manypixels Gallery",
      "url": "https://www.manypixels.co/gallery",
      "emoji": "🧑‍🎨",
      "cats": ["illustrations"],
      "license": "pro",
      "licenseName": "Site license",
      "account": false,
      "desc": {"fr":"Illustrations vectorielles recolorables, utilisables sans crédit ; interdit de les redistribuer en packs.","en":"Recolorable vector illustrations usable without credit; redistributing them as packs is not allowed."}
    },
    {
      "name": "3dicons",
      "url": "https://3dicons.co/",
      "emoji": "🧊",
      "cats": ["icones","3d"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Icônes 3D en CC0 dans plusieurs styles et angles, avec les fichiers sources Blender.","en":"3D icons under CC0 in several styles and angles, with the Blender source files."}
    },
    {
      "name": "Pictogrammers (Material Design Icons)",
      "url": "https://pictogrammers.com/library/mdi/",
      "emoji": "🏠",
      "cats": ["icones","web"],
      "license": "pro",
      "licenseName": "Apache 2.0",
      "account": false,
      "desc": {"fr":"Material Design Icons : des milliers d'icônes d'interface open source, dont beaucoup de niche.","en":"Material Design Icons: thousands of open source UI icons, many of them for niche topics."}
    },
    {
      "name": "Fluent UI System Icons",
      "url": "https://github.com/microsoft/fluentui-system-icons",
      "emoji": "🪟",
      "cats": ["icones"],
      "license": "pro",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Icônes d'interface de Microsoft sous licence MIT, en version contour et pleine, plusieurs tailles.","en":"Microsoft's UI icons under the MIT license, in outline and filled styles and several sizes."}
    },
    {
      "name": "IconPark",
      "url": "https://iconpark.oceanengine.com/",
      "emoji": "🎡",
      "cats": ["icones"],
      "license": "pro",
      "licenseName": "Apache 2.0",
      "account": false,
      "desc": {"fr":"Icônes open source de ByteDance en quatre styles, réglables avant l'export en SVG ou PNG.","en":"Open source icons by ByteDance in four styles, adjustable before SVG or PNG export."}
    },
    {
      "name": "Bunny Fonts",
      "url": "https://fonts.bunny.net/",
      "emoji": "🐰",
      "cats": ["polices","web"],
      "license": "pro",
      "licenseName": "SIL OFL",
      "account": false,
      "desc": {"fr":"Les polices de Google Fonts servies par un CDN européen qui ne collecte pas les données des visiteurs.","en":"Google Fonts' typefaces served from a European CDN that does not log visitor data."}
    },
    {
      "name": "Fontsource",
      "url": "https://fontsource.org/",
      "emoji": "📦",
      "cats": ["polices","web"],
      "license": "pro",
      "licenseName": "SIL OFL",
      "account": false,
      "desc": {"fr":"Polices libres en paquets npm pour les auto-héberger dans un projet web.","en":"Open source fonts packaged on npm to self-host them in a web project."}
    },
    {
      "name": "Badass Libre Fonts by Womxn",
      "url": "https://www.design-research.be/by-womxn/",
      "emoji": "✊",
      "cats": ["polices"],
      "license": "mixte",
      "licenseName": "OFL / GPL / CC",
      "account": false,
      "desc": {"fr":"Polices libres dessinées par des femmes, surtout sous OFL, avec un lien vers chaque créatrice.","en":"Libre fonts designed by women, mostly under the OFL, with a link to each designer."}
    },
    {
      "name": "Bye Bye Binary — Typothèque",
      "url": "https://typotheque.genderfluid.space/",
      "emoji": "⚧",
      "cats": ["polices"],
      "license": "mixte",
      "licenseName": "OFL / CC BY-NC-SA",
      "account": false,
      "desc": {"fr":"Polices post-binaires pour l'écriture inclusive en français ; licence à lire pour chaque fonte.","en":"Post-binary fonts for gender-inclusive French writing; read each font's license before use."}
    },
    {
      "name": "FontSpace",
      "url": "https://www.fontspace.com/",
      "emoji": "🔤",
      "cats": ["polices"],
      "license": "mixte",
      "licenseName": "Variable",
      "account": false,
      "desc": {"fr":"Polices gratuites de créateurs indépendants ; beaucoup sont réservées à l'usage personnel.","en":"Free fonts from independent designers; many are for personal use only."}
    },
    {
      "name": "cgbookcase",
      "url": "https://www.cgbookcase.com/",
      "emoji": "🧱",
      "cats": ["textures","3d"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Textures PBR en CC0 jusqu'en 4K, financées par les dons, sans compte.","en":"CC0 PBR textures up to 4K, funded by donations, no account needed."}
    },
    {
      "name": "ShareTextures",
      "url": "https://www.sharetextures.com/",
      "emoji": "🌿",
      "cats": ["textures","3d"],
      "license": "pro",
      "licenseName": "Custom CC0",
      "account": false,
      "desc": {"fr":"Textures PBR, modèles 3D et atlas de feuillage gratuits ; redistribution interdite.","en":"Free PBR textures, 3D models and foliage atlases; redistributing them is not allowed."}
    },
    {
      "name": "The Base Mesh",
      "url": "https://www.thebasemesh.com/",
      "emoji": "🧍",
      "cats": ["3d"],
      "license": "cc0",
      "licenseName": "CC0",
      "account": false,
      "desc": {"fr":"Plus de 1000 maillages de base en CC0 à l'échelle réelle, en OBJ, FBX et GLB.","en":"Over 1,000 real-scale base meshes under CC0, in OBJ, FBX and GLB."}
    },
    {
      "name": "Three D Scans",
      "url": "https://threedscans.com/",
      "emoji": "🗿",
      "cats": ["3d"],
      "license": "cc0",
      "licenseName": "No copyright claimed",
      "account": false,
      "desc": {"fr":"Scans 3D de sculptures de musées, publiés par l'artiste sans revendiquer de droit d'auteur.","en":"3D scans of museum sculptures, published by the artist without claiming copyright."}
    },
    {
      "name": "NASA 3D Resources",
      "url": "https://science.nasa.gov/3d-resources/",
      "emoji": "🚀",
      "cats": ["3d"],
      "license": "cc0",
      "licenseName": "Public domain",
      "account": false,
      "desc": {"fr":"Modèles 3D de satellites, sondes et astres de la NASA, libres selon les règles médias de la NASA.","en":"NASA 3D models of spacecraft, probes and planets, free under NASA's media usage guidelines."}
    },
    {
      "name": "David Revoy Krita brushes",
      "url": "https://www.davidrevoy.com/article1060/krita-brushes-2025-01-bundle/show",
      "emoji": "🖌️",
      "cats": ["brushes"],
      "license": "mixte",
      "licenseName": "CC0 / CC BY 4.0",
      "account": false,
      "desc": {"fr":"Brosses Krita du peintre David Revoy ; la licence (CC0 ou CC BY) change d'un pack à l'autre.","en":"Krita brushes by painter David Revoy; the license (CC0 or CC BY) changes from one bundle to the next."}
    },
    {
      "name": "Leonardo",
      "url": "https://leonardocolor.io/",
      "emoji": "🌈",
      "cats": ["couleurs","en-ligne"],
      "license": "opensource",
      "licenseName": "Apache 2.0",
      "account": false,
      "desc": {"fr":"Outil d'Adobe pour créer des couleurs d'interface qui respectent un contraste WCAG choisi.","en":"Adobe tool to build UI colors that meet a chosen WCAG contrast ratio."}
    },
    {
      "name": "Sanzo Wada — A Dictionary of Color Combinations",
      "url": "https://sanzo-wada.dmbk.io/",
      "emoji": "🎎",
      "cats": ["couleurs","inspi"],
      "license": "outil",
      "licenseName": "Free",
      "account": false,
      "desc": {"fr":"Les combinaisons de couleurs du livre de Sanzo Wada, à copier avec leurs codes couleur.","en":"The color combinations from Sanzo Wada's book, ready to copy with their color codes."}
    },
    {
      "name": "Pattern Monster",
      "url": "https://pattern.monster/",
      "emoji": "👹",
      "cats": ["textures","en-ligne"],
      "license": "opensource",
      "licenseName": "MIT",
      "account": false,
      "desc": {"fr":"Générateur de motifs SVG répétables : couleurs, trait, angle et échelle, export en SVG ou PNG.","en":"Repeating SVG pattern generator: colors, stroke, angle and scale, exported as SVG or PNG."}
    }
  ]
};
