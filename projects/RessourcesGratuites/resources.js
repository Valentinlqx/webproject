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
    {"id":"png","family":"visuels","fr":"Détourés","en":"Cutouts"},
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
  "legacyCats": {"images":"photos","polices":"polices","icones":"icones","illustrations":"illustrations","couleurs":"couleurs","design":"logiciels","sons":"effets","musiques":"musique","mockups":"mockups","jeux":"jeux","web":"web","video":"footage","textures":"textures","brushes":"brushes","png":"png","outils":"en-ligne","tutos":"tutos","inspi":"inspi","motion":"motion","3d":"3d","opensource":null,"ia":null,"ai-skills":null},
  "resources": [
    {
      "name": "Unsplash",
      "url": "https://unsplash.com",
      "emoji": "🌄",
      "cats": ["photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Photos haute résolution gratuites et libres de droits, contributées par une communauté mondiale.","en":"Photos haute résolution gratuites et libres de droits, contributées par une communauté mondiale."}
    },
    {
      "name": "Pexels",
      "url": "https://pexels.com",
      "emoji": "📷",
      "cats": ["photos","footage"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Photos et vidéos HD gratuites par une communauté mondiale de créateurs talentueux.","en":"Photos et vidéos HD gratuites par une communauté mondiale de créateurs talentueux."}
    },
    {
      "name": "Pixabay",
      "url": "https://pixabay.com",
      "emoji": "🖼️",
      "cats": ["photos","footage","effets","musique"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Plus d'un million d'images, vidéos, sons et musiques libres de droits sous licence CC0.","en":"Plus d'un million d'images, vidéos, sons et musiques libres de droits sous licence CC0."}
    },
    {
      "name": "Pixabay Audio",
      "url": "https://pixabay.com/music/",
      "emoji": "🎶",
      "cats": ["effets","musique"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Section audio de Pixabay : musiques et effets sonores spécifiquement classés et filtrables.","en":"Section audio de Pixabay : musiques et effets sonores spécifiquement classés et filtrables."}
    },
    {
      "name": "StockSnap",
      "url": "https://stocksnap.io",
      "emoji": "📸",
      "cats": ["photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Des centaines de nouvelles photos libres de droits ajoutées chaque semaine.","en":"Des centaines de nouvelles photos libres de droits ajoutées chaque semaine."}
    },
    {
      "name": "Burst",
      "url": "https://burst.shopify.com",
      "emoji": "⚡",
      "cats": ["photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Photos gratuites pour créateurs et entrepreneurs, par Shopify.","en":"Photos gratuites pour créateurs et entrepreneurs, par Shopify."}
    },
    {
      "name": "Life of Pix",
      "url": "https://www.lifeofpix.com",
      "emoji": "🌿",
      "cats": ["photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Photos haute résolution libres de droits pour usage personnel et commercial.","en":"Photos haute résolution libres de droits pour usage personnel et commercial."}
    },
    {
      "name": "Nappy",
      "url": "https://nappy.co/",
      "emoji": "🤎",
      "cats": ["photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Photographies authentiques de personnes de couleur, gratuites pour usage commercial.","en":"Photographies authentiques de personnes de couleur, gratuites pour usage commercial."}
    },
    {
      "name": "Rawpixel Public Domain",
      "url": "https://www.rawpixel.com/public-domain",
      "emoji": "🏛️",
      "cats": ["photos","illustrations"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Images et illustrations du domaine public à télécharger librement pour tout usage.","en":"Images et illustrations du domaine public à télécharger librement pour tout usage."}
    },
    {
      "name": "Public.work",
      "url": "https://public.work/",
      "emoji": "🔍",
      "cats": ["photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection d'images sous licence CC0 pour projets créatifs, recherchables facilement.","en":"Collection d'images sous licence CC0 pour projets créatifs, recherchables facilement."}
    },
    {
      "name": "ISO Republic",
      "url": "https://isorepublic.com/",
      "emoji": "🌐",
      "cats": ["photos","footage","effets"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Photos, vidéos et pistes audio gratuites et libres de droits pour usage commercial.","en":"Photos, vidéos et pistes audio gratuites et libres de droits pour usage commercial."}
    },
    {
      "name": "Toools Stock Photos",
      "url": "https://www.toools.design/free-stock-photo-and-video-websites",
      "emoji": "📋",
      "cats": ["photos","footage"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Liste d'agrégateurs de sites de photos et vidéos libres de droits sélectionnés.","en":"Liste d'agrégateurs de sites de photos et vidéos libres de droits sélectionnés."}
    },
    {
      "name": "Google Fonts",
      "url": "https://fonts.google.com",
      "emoji": "🔡",
      "cats": ["polices"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Bibliothèque de plus de 1400 polices open-source, directement intégrables en CSS.","en":"Bibliothèque de plus de 1400 polices open-source, directement intégrables en CSS."}
    },
    {
      "name": "Font Squirrel",
      "url": "https://www.fontsquirrel.com",
      "emoji": "🐿️",
      "cats": ["polices"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Polices libres de droits sélectionnées à la main, toutes utilisables commercialement.","en":"Polices libres de droits sélectionnées à la main, toutes utilisables commercialement."}
    },
    {
      "name": "Fontesk",
      "url": "https://fontesk.com",
      "emoji": "✍️",
      "cats": ["polices"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Polices gratuites soigneusement sélectionnées pour usage personnel et commercial.","en":"Polices gratuites soigneusement sélectionnées pour usage personnel et commercial."}
    },
    {
      "name": "Free Faces",
      "url": "https://www.freefaces.gallery/",
      "emoji": "🖼️",
      "cats": ["polices"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Galerie de polices gratuites et open-source avec aperçus dynamiques et téléchargement direct.","en":"Galerie de polices gratuites et open-source avec aperçus dynamiques et téléchargement direct."}
    },
    {
      "name": "Fontshare",
      "url": "https://www.fontshare.com/",
      "emoji": "🤝",
      "cats": ["polices"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Bibliothèque collaborative de polices gratuites pour projets personnels et commerciaux.","en":"Bibliothèque collaborative de polices gratuites pour projets personnels et commerciaux."}
    },
    {
      "name": "Velvetyne",
      "url": "https://velvetyne.fr/",
      "emoji": "🧪",
      "cats": ["polices"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Fonderie en ligne offrant des polices libres et expérimentales sous Open Font License.","en":"Fonderie en ligne offrant des polices libres et expérimentales sous Open Font License."}
    },
    {
      "name": "Open Foundry",
      "url": "https://open-foundry.com/fonts",
      "emoji": "🔓",
      "cats": ["polices"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Plateforme de polices open-source sélectionnées pour leur qualité et leur diversité.","en":"Plateforme de polices open-source sélectionnées pour leur qualité et leur diversité."}
    },
    {
      "name": "Toools Font Library",
      "url": "https://www.toools.design/font-library-and-inspiration",
      "emoji": "📚",
      "cats": ["polices"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Bibliothèque de ressources et d'inspirations typographiques pour designers.","en":"Bibliothèque de ressources et d'inspirations typographiques pour designers."}
    },
    {
      "name": "BeFonts",
      "url": "https://befonts.com/",
      "emoji": "🅱️",
      "cats": ["polices"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Annuaire de polices gratuites classées par style et popularité, téléchargement libre.","en":"Annuaire de polices gratuites classées par style et popularité, téléchargement libre."}
    },
    {
      "name": "FontJoy",
      "url": "https://fontjoy.com/",
      "emoji": "🎯",
      "cats": ["polices","en-ligne"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Outil IA d'aide à la création de paires de polices harmonieuses en un clic.","en":"Outil IA d'aide à la création de paires de polices harmonieuses en un clic."}
    },
    {
      "name": "Unblast Fonts",
      "url": "https://unblast.com/fonts/",
      "emoji": "💥",
      "cats": ["polices"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection de polices gratuites de qualité professionnelle pour tout usage créatif.","en":"Collection de polices gratuites de qualité professionnelle pour tout usage créatif."}
    },
    {
      "name": "Resourceboy Fonts",
      "url": "https://resourceboy.com/fonts/",
      "emoji": "📦",
      "cats": ["polices"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Vaste section de polices gratuites au sein de la plateforme Resourceboy.","en":"Vaste section de polices gratuites au sein de la plateforme Resourceboy."}
    },
    {
      "name": "Fonts In Use",
      "url": "https://fontsinuse.com/",
      "emoji": "🔍",
      "cats": ["polices","inspi"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Base de données de polices identifiées dans le design et la publicité, avec études de cas.","en":"Base de données de polices identifiées dans le design et la publicité, avec études de cas."}
    },
    {
      "name": "Text Studio",
      "url": "https://www.textstudio.com/",
      "emoji": "🎨",
      "cats": ["polices","en-ligne"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Outils en ligne pour tester, combiner et affiner des polices dans vos projets.","en":"Outils en ligne pour tester, combiner et affiner des polices dans vos projets."}
    },
    {
      "name": "Heroicons",
      "url": "https://heroicons.com",
      "emoji": "⚡",
      "cats": ["icones"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Icônes SVG open-source créées par l'équipe de Tailwind CSS.","en":"Icônes SVG open-source créées par l'équipe de Tailwind CSS."}
    },
    {
      "name": "Lucide",
      "url": "https://lucide.dev",
      "emoji": "🌟",
      "cats": ["icones"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection d'icônes open-source cohérente et élégante, fork de Feather Icons.","en":"Collection d'icônes open-source cohérente et élégante, fork de Feather Icons."}
    },
    {
      "name": "SVG Repo",
      "url": "https://www.svgrepo.com",
      "emoji": "🔷",
      "cats": ["icones"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection massive de plus de 500 000 icônes SVG gratuites et open-source.","en":"Collection massive de plus de 500 000 icônes SVG gratuites et open-source."}
    },
    {
      "name": "Tabler Icons",
      "url": "https://tabler-icons.io",
      "emoji": "📐",
      "cats": ["icones"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Plus de 4000 icônes SVG pixel-perfect, open-source et entièrement personnalisables.","en":"Plus de 4000 icônes SVG pixel-perfect, open-source et entièrement personnalisables."}
    },
    {
      "name": "Phosphor Icons",
      "url": "https://phosphoricons.com",
      "emoji": "🧪",
      "cats": ["icones"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Famille d'icônes flexible avec 6 styles différents pour chaque icône.","en":"Famille d'icônes flexible avec 6 styles différents pour chaque icône."}
    },
    {
      "name": "Toools Icon Libraries",
      "url": "https://www.toools.design/free-open-source-icon-libraries",
      "emoji": "📚",
      "cats": ["icones"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Sélection de bibliothèques d'icônes open-source gratuites, triées et commentées.","en":"Sélection de bibliothèques d'icônes open-source gratuites, triées et commentées."}
    },
    {
      "name": "Ionicons",
      "url": "https://ionic.io/ionicons",
      "emoji": "⚡",
      "cats": ["icones"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Ensemble d'icônes vectorielles pour applications mobiles et web, maintenu par Ionic.","en":"Ensemble d'icônes vectorielles pour applications mobiles et web, maintenu par Ionic."}
    },
    {
      "name": "Simple Icons",
      "url": "https://simpleicons.org/",
      "emoji": "🏷️",
      "cats": ["icones"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Icônes SVG de marques et logos populaires, libres pour tout usage web.","en":"Icônes SVG de marques et logos populaires, libres pour tout usage web."}
    },
    {
      "name": "Iconify",
      "url": "https://icon-sets.iconify.design",
      "emoji": "🔗",
      "cats": ["icones"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Plateforme unifiant des dizaines de sets d'icônes open-source, utilisable en CSS ou JS.","en":"Plateforme unifiant des dizaines de sets d'icônes open-source, utilisable en CSS ou JS."}
    },
    {
      "name": "Iconduck",
      "url": "https://iconduck.com/",
      "emoji": "🦆",
      "cats": ["icones"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Annuaire d'icônes gratuites avec recherche par style et filtre par licence.","en":"Annuaire d'icônes gratuites avec recherche par style et filtre par licence."}
    },
    {
      "name": "Glyphter",
      "url": "https://www.glyphter.com/",
      "emoji": "✏️",
      "cats": ["icones","en-ligne"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Créez vos propres fontes d'icônes personnalisées à partir de SVGs importés.","en":"Créez vos propres fontes d'icônes personnalisées à partir de SVGs importés."}
    },
    {
      "name": "Reshot",
      "url": "https://www.reshot.com/",
      "emoji": "📷",
      "cats": ["icones","photos","illustrations"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Banque d'icônes et de photos gratuites soigneusement sélectionnées pour projets variés.","en":"Banque d'icônes et de photos gratuites soigneusement sélectionnées pour projets variés."}
    },
    {
      "name": "unDraw",
      "url": "https://undraw.co",
      "emoji": "🎨",
      "cats": ["illustrations"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Illustrations SVG open-source personnalisables en couleur pour tous vos projets.","en":"Illustrations SVG open-source personnalisables en couleur pour tous vos projets."}
    },
    {
      "name": "Storyset",
      "url": "https://storyset.com",
      "emoji": "📖",
      "cats": ["illustrations"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Illustrations animées gratuites et personnalisables pour sites web et applications.","en":"Illustrations animées gratuites et personnalisables pour sites web et applications."}
    },
    {
      "name": "Open Doodles",
      "url": "https://opendoodles.com",
      "emoji": "✏️",
      "cats": ["illustrations"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Croquis et doodles libres de droits dans un style minimaliste et moderne.","en":"Croquis et doodles libres de droits dans un style minimaliste et moderne."}
    },
    {
      "name": "Humaaans",
      "url": "https://www.humaaans.com",
      "emoji": "👥",
      "cats": ["illustrations"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Mix-and-match illustrations de personnes entièrement modulables, par Pablo Stanley.","en":"Mix-and-match illustrations de personnes entièrement modulables, par Pablo Stanley."}
    },
    {
      "name": "Open Peeps",
      "url": "https://openpeeps.com/",
      "emoji": "🙋",
      "cats": ["illustrations"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Pack de personnages dessinés à la main et entièrement modifiables, par Pablo Stanley.","en":"Pack de personnages dessinés à la main et entièrement modifiables, par Pablo Stanley."}
    },
    {
      "name": "Absurd Design",
      "url": "https://absurd.design/",
      "emoji": "🌀",
      "cats": ["illustrations"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Illustrations absurdes et artistiques pour rendre vos designs uniques et mémorables.","en":"Illustrations absurdes et artistiques pour rendre vos designs uniques et mémorables."}
    },
    {
      "name": "Lukasz Adam",
      "url": "https://lukaszadam.com/illustrations",
      "emoji": "◻️",
      "cats": ["illustrations"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Série d'illustrations minimalistes et abstraites gratuites créées par Lukasz Adam.","en":"Série d'illustrations minimalistes et abstraites gratuites créées par Lukasz Adam."}
    },
    {
      "name": "Internet Archive Book Images",
      "url": "https://www.flickr.com/photos/internetarchivebookimages/",
      "emoji": "📖",
      "cats": ["illustrations","photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection d'images d'archives libres de droits issues de livres anciens numérisés.","en":"Collection d'images d'archives libres de droits issues de livres anciens numérisés."}
    },
    {
      "name": "Adobe Color",
      "url": "https://color.adobe.com",
      "emoji": "🌈",
      "cats": ["couleurs"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Créez, explorez et partagez des palettes basées sur les règles de théorie des couleurs.","en":"Créez, explorez et partagez des palettes basées sur les règles de théorie des couleurs."}
    },
    {
      "name": "Color Hunt",
      "url": "https://colorhunt.co",
      "emoji": "🎯",
      "cats": ["couleurs"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Palettes de couleurs tendance sélectionnées par une communauté de créateurs.","en":"Palettes de couleurs tendance sélectionnées par une communauté de créateurs."}
    },
    {
      "name": "Realtime Colors",
      "url": "https://www.realtimecolors.com",
      "emoji": "⚡",
      "cats": ["couleurs"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Visualisez votre palette de couleurs sur un vrai site web, en temps réel.","en":"Visualisez votre palette de couleurs sur un vrai site web, en temps réel."}
    },
    {
      "name": "UI Colors",
      "url": "https://uicolors.app",
      "emoji": "🔢",
      "cats": ["couleurs"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générez des échelles de teintes Tailwind-ready depuis n'importe quelle couleur de base.","en":"Générez des échelles de teintes Tailwind-ready depuis n'importe quelle couleur de base."}
    },
    {
      "name": "Resourceboy Gradients",
      "url": "https://resourceboy.com/photoshop-gradients/",
      "emoji": "🎨",
      "cats": ["couleurs"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection de dégradés gratuits à importer facilement dans Photoshop.","en":"Collection de dégradés gratuits à importer facilement dans Photoshop."}
    },
    {
      "name": "Gradient Hunt",
      "url": "https://gradienthunt.com/",
      "emoji": "🌈",
      "cats": ["couleurs"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Bibliothèque interactive de dégradés CSS prêts à l'emploi, copiables en un clic.","en":"Bibliothèque interactive de dégradés CSS prêts à l'emploi, copiables en un clic."}
    },
    {
      "name": "Paletton",
      "url": "https://paletton.com/",
      "emoji": "🔵",
      "cats": ["couleurs"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Outil avancé de théorie des couleurs pour construire des palettes harmonieuses.","en":"Outil avancé de théorie des couleurs pour construire des palettes harmonieuses."}
    },
    {
      "name": "Open Color",
      "url": "https://yeun.github.io/open-color/",
      "emoji": "🎨",
      "cats": ["couleurs"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Palette de couleurs open-source optimisée pour l'UI, disponible en CSS, Sass et plus.","en":"Palette de couleurs open-source optimisée pour l'UI, disponible en CSS, Sass et plus."}
    },
    {
      "name": "Penpot",
      "url": "https://penpot.app",
      "emoji": "🐾",
      "cats": ["logiciels"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Alternative open-source à Figma, 100% gratuite et auto-hébergeable.","en":"Alternative open-source à Figma, 100% gratuite et auto-hébergeable."}
    },
    {
      "name": "Photopea",
      "url": "https://www.photopea.com",
      "emoji": "🖊️",
      "cats": ["logiciels","en-ligne"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Éditeur photo avancé dans le navigateur, compatible Photoshop — totalement gratuit.","en":"Éditeur photo avancé dans le navigateur, compatible Photoshop — totalement gratuit."}
    },
    {
      "name": "Squoosh",
      "url": "https://squoosh.app",
      "emoji": "🗜️",
      "cats": ["logiciels","en-ligne"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Compressez et convertissez vos images directement dans le navigateur, sans perte de qualité.","en":"Compressez et convertissez vos images directement dans le navigateur, sans perte de qualité."}
    },
    {
      "name": "GIMP",
      "url": "https://www.gimp.org/",
      "emoji": "🐶",
      "cats": ["logiciels"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Éditeur d'images open-source et gratuit, alternative puissante à Photoshop.","en":"Éditeur d'images open-source et gratuit, alternative puissante à Photoshop."}
    },
    {
      "name": "Krita",
      "url": "https://krita.org/",
      "emoji": "🖌️",
      "cats": ["logiciels","illustrations"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Application de peinture numérique open-source, idéale pour l'illustration et le concept art.","en":"Application de peinture numérique open-source, idéale pour l'illustration et le concept art."}
    },
    {
      "name": "Inkscape",
      "url": "https://inkscape.org/",
      "emoji": "✒️",
      "cats": ["logiciels"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Éditeur de graphiques vectoriels open-source, alternative gratuite à Illustrator.","en":"Éditeur de graphiques vectoriels open-source, alternative gratuite à Illustrator."}
    },
    {
      "name": "Lunacy",
      "url": "https://icons8.com/lunacy",
      "emoji": "🌙",
      "cats": ["logiciels"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Logiciel de design gratuit pour Windows/Mac/Linux, compatible fichiers Figma et Sketch.","en":"Logiciel de design gratuit pour Windows/Mac/Linux, compatible fichiers Figma et Sketch."}
    },
    {
      "name": "Freesound",
      "url": "https://freesound.org",
      "emoji": "🔊",
      "cats": ["effets"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Bibliothèque collaborative de sons et effets sonores libres de droits, par la communauté.","en":"Bibliothèque collaborative de sons et effets sonores libres de droits, par la communauté."}
    },
    {
      "name": "Mixkit",
      "url": "https://mixkit.co",
      "emoji": "🎵",
      "cats": ["effets","musique","footage"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Sons, effets sonores, musiques et vidéos stock 100% gratuits et libres pour vos créations.","en":"Sons, effets sonores, musiques et vidéos stock 100% gratuits et libres pour vos créations."}
    },
    {
      "name": "Free Music Archive",
      "url": "https://freemusicarchive.org",
      "emoji": "🎸",
      "cats": ["effets","musique"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Archive de musique libre, légale et haute qualité pour projets créatifs.","en":"Archive de musique libre, légale et haute qualité pour projets créatifs."}
    },
    {
      "name": "SoundJay",
      "url": "https://www.soundjay.com/",
      "emoji": "🔔",
      "cats": ["effets"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Bibliothèque d'effets sonores et bruitages gratuits pour projets multimédias.","en":"Bibliothèque d'effets sonores et bruitages gratuits pour projets multimédias."}
    },
    {
      "name": "Big Sound Bank",
      "url": "https://bigsoundbank.com/categories.html",
      "emoji": "🏦",
      "cats": ["effets"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection d'effets sonores organisés par catégorie, téléchargeables gratuitement.","en":"Collection d'effets sonores organisés par catégorie, téléchargeables gratuitement."}
    },
    {
      "name": "ccMixter",
      "url": "https://ccmixter.org/",
      "emoji": "🎛️",
      "cats": ["effets","musique"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Communauté de musique sous licence Creative Commons — remix, samples et morceaux complets.","en":"Communauté de musique sous licence Creative Commons — remix, samples et morceaux complets."}
    },
    {
      "name": "Incompetech",
      "url": "https://incompetech.com/music/royalty-free/music.html",
      "emoji": "🎹",
      "cats": ["musique"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Bibliothèque de musiques libres de droits composées par Kevin MacLeod, classées par genre.","en":"Bibliothèque de musiques libres de droits composées par Kevin MacLeod, classées par genre."}
    },
    {
      "name": "NCS",
      "url": "https://ncs.io/",
      "emoji": "⚡",
      "cats": ["musique"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"NoCopyrightSounds : musiques électroniques gratuites pour créateurs de contenus YouTube.","en":"NoCopyrightSounds : musiques électroniques gratuites pour créateurs de contenus YouTube."}
    },
    {
      "name": "Scott Buckley",
      "url": "https://www.scottbuckley.com.au/library/",
      "emoji": "🎻",
      "cats": ["musique"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Catalogue de musiques orchestrales et ambiantes composées par Scott Buckley, gratuites.","en":"Catalogue de musiques orchestrales et ambiantes composées par Scott Buckley, gratuites."}
    },
    {
      "name": "StreamBeats",
      "url": "https://streambeats.com/",
      "emoji": "📡",
      "cats": ["musique"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Musiques d'ambiance gratuites pour streamers et créateurs, par Harris Heller.","en":"Musiques d'ambiance gratuites pour streamers et créateurs, par Harris Heller."}
    },
    {
      "name": "Purple Planet",
      "url": "https://www.purple-planet.com/",
      "emoji": "🪐",
      "cats": ["musique"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Musiques libres de droits pour vidéos et podcasts, couvrant de nombreux genres.","en":"Musiques libres de droits pour vidéos et podcasts, couvrant de nombreux genres."}
    },
    {
      "name": "Imuno SourceAudio",
      "url": "https://imuno.sourceaudio.com/home",
      "emoji": "🔊",
      "cats": ["musique"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Plateforme SourceAudio proposant une sélection de musiques gratuites pour créateurs.","en":"Plateforme SourceAudio proposant une sélection de musiques gratuites pour créateurs."}
    },
    {
      "name": "Freepik Tunes",
      "url": "https://tunes.freepik.com/",
      "emoji": "🎵",
      "cats": ["musique","effets"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Moteur de recherche de musiques et effets sonores gratuits pour projets créatifs.","en":"Moteur de recherche de musiques et effets sonores gratuits pour projets créatifs."}
    },
    {
      "name": "Film Music IO",
      "url": "https://filmmusic.io/en",
      "emoji": "🎬",
      "cats": ["musique"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Catalogue de musiques Creative Commons pour vidéos YouTube et projets audiovisuels.","en":"Catalogue de musiques Creative Commons pour vidéos YouTube et projets audiovisuels."}
    },
    {
      "name": "JCAZ Music",
      "url": "https://jcazmusic.com/free-stuff",
      "emoji": "🎸",
      "cats": ["musique"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Section de téléchargements gratuits de pistes musicales originales pour créateurs.","en":"Section de téléchargements gratuits de pistes musicales originales pour créateurs."}
    },
    {
      "name": "Free Stock Music",
      "url": "https://www.free-stock-music.com/",
      "emoji": "🗂️",
      "cats": ["musique"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Bibliothèque de musiques gratuites à utiliser dans vos vidéos et podcasts.","en":"Bibliothèque de musiques gratuites à utiliser dans vos vidéos et podcasts."}
    },
    {
      "name": "Silverman Sound",
      "url": "https://www.silvermansound.com/free-music",
      "emoji": "🥈",
      "cats": ["musique"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Sélection de compositions originales offertes gratuitement pour projets créatifs.","en":"Sélection de compositions originales offertes gratuitement pour projets créatifs."}
    },
    {
      "name": "Moby Gratis",
      "url": "https://mobygratis.com/",
      "emoji": "🐋",
      "cats": ["musique"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection de musiques de Moby offertes gratuitement pour projets à but non commercial.","en":"Collection de musiques de Moby offertes gratuitement pour projets à but non commercial."}
    },
    {
      "name": "GraphicBurger",
      "url": "https://graphicburger.com",
      "emoji": "🍔",
      "cats": ["mockups","textures"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Ressources design premium gratuites — mockups, templates, textures et UI kits.","en":"Ressources design premium gratuites — mockups, templates, textures et UI kits."}
    },
    {
      "name": "Toools.design Mockups",
      "url": "https://www.toools.design/mockups-ui-kits-and-freebies",
      "emoji": "🗂️",
      "cats": ["mockups"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Sélection de mockups, UI kits et freebies design pour maquettes et présentations.","en":"Sélection de mockups, UI kits et freebies design pour maquettes et présentations."}
    },
    {
      "name": "Resourceboy Mockups",
      "url": "https://resourceboy.com/mockups/",
      "emoji": "📦",
      "cats": ["mockups"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection organisée de mockups gratuits (appareils, print, packaging) téléchargeables.","en":"Collection organisée de mockups gratuits (appareils, print, packaging) téléchargeables."}
    },
    {
      "name": "Mockuphone",
      "url": "https://mockuphone.com/",
      "emoji": "📱",
      "cats": ["mockups"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Mockups de smartphones, tablettes et montres à personnaliser en ligne et télécharger.","en":"Mockups de smartphones, tablettes et montres à personnaliser en ligne et télécharger."}
    },
    {
      "name": "Screely",
      "url": "https://screely.com",
      "emoji": "🖼️",
      "cats": ["mockups"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Transformez vos captures d'écran en présentations élégantes et mockups stylisés en ligne.","en":"Transformez vos captures d'écran en présentations élégantes et mockups stylisés en ligne."}
    },
    {
      "name": "Material Maker",
      "url": "https://www.materialmaker.org/",
      "emoji": "🧱",
      "cats": ["jeux","textures"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Éditeur de matériaux procédural et générateur de textures basé sur des nœuds, inspiré de Godot.","en":"Éditeur de matériaux procédural et générateur de textures basé sur des nœuds, inspiré de Godot."}
    },
    {
      "name": "Godot Shaders",
      "url": "https://godotshaders.com/",
      "emoji": "✨",
      "cats": ["jeux"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Bibliothèque en ligne de shaders prêts à l'emploi pour le moteur de jeu Godot.","en":"Bibliothèque en ligne de shaders prêts à l'emploi pour le moteur de jeu Godot."}
    },
    {
      "name": "Shadertoy",
      "url": "https://www.shadertoy.com/",
      "emoji": "🔮",
      "cats": ["jeux","web"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Plateforme communautaire pour coder et partager des shaders GLSL interactifs en temps réel.","en":"Plateforme communautaire pour coder et partager des shaders GLSL interactifs en temps réel."}
    },
    {
      "name": "Tilemancer",
      "url": "https://led.itch.io/tilemancer",
      "emoji": "🧩",
      "cats": ["jeux"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générateur de tilesets procédural pour jeux en pixel art, disponible sur itch.io.","en":"Générateur de tilesets procédural pour jeux en pixel art, disponible sur itch.io."}
    },
    {
      "name": "LPC Spritesheet Generator",
      "url": "https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/",
      "emoji": "🧍",
      "cats": ["jeux"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générateur de personnages au format LPC avec personnalisation complète des sprites.","en":"Générateur de personnages au format LPC avec personnalisation complète des sprites."}
    },
    {
      "name": "LibreSprite",
      "url": "https://libresprite.github.io/",
      "emoji": "🖼️",
      "cats": ["jeux","en-ligne"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Éditeur de pixel art et d'animations open-source, fork gratuit d'Aseprite.","en":"Éditeur de pixel art et d'animations open-source, fork gratuit d'Aseprite."}
    },
    {
      "name": "Piskel",
      "url": "https://www.piskelapp.com/",
      "emoji": "🎨",
      "cats": ["jeux","en-ligne"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Éditeur gratuit de pixel art en ligne, avec export de spritesheets animées.","en":"Éditeur gratuit de pixel art en ligne, avec export de spritesheets animées."}
    },
    {
      "name": "DragonBones",
      "url": "https://dragonbones.github.io/en/download.html",
      "emoji": "🦴",
      "cats": ["jeux"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Suite d'outils pour créer des animations 2D squelettiques, alternative gratuite à Spine.","en":"Suite d'outils pour créer des animations 2D squelettiques, alternative gratuite à Spine."}
    },
    {
      "name": "MagicaVoxel",
      "url": "https://ephtracy.github.io/",
      "emoji": "🧊",
      "cats": ["jeux","en-ligne"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Éditeur de voxel 3D léger et gratuit avec rendu en temps réel.","en":"Éditeur de voxel 3D léger et gratuit avec rendu en temps réel."}
    },
    {
      "name": "Blockbench",
      "url": "https://www.blockbench.net/",
      "emoji": "🟦",
      "cats": ["jeux","en-ligne"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Créateur de modèles 3D low-poly et pixel-art pour Minecraft et jeux similaires.","en":"Créateur de modèles 3D low-poly et pixel-art pour Minecraft et jeux similaires."}
    },
    {
      "name": "Tiled",
      "url": "https://www.mapeditor.org/",
      "emoji": "🗾",
      "cats": ["jeux","en-ligne"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Éditeur de cartes par tuiles polyvalent pour le développement de jeux 2D.","en":"Éditeur de cartes par tuiles polyvalent pour le développement de jeux 2D."}
    },
    {
      "name": "TrenchBroom",
      "url": "https://trenchbroom.github.io/",
      "emoji": "🏗️",
      "cats": ["jeux"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Éditeur de maps 3D pour jeux basés sur le moteur Quake, intuitif et puissant.","en":"Éditeur de maps 3D pour jeux basés sur le moteur Quake, intuitif et puissant."}
    },
    {
      "name": "OpenGameArt",
      "url": "https://opengameart.org/",
      "emoji": "🎭",
      "cats": ["jeux","photos","effets"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Plateforme communautaire de ressources graphiques, sonores et code open-source pour jeux.","en":"Plateforme communautaire de ressources graphiques, sonores et code open-source pour jeux."}
    },
    {
      "name": "Quaternius",
      "url": "https://quaternius.com/",
      "emoji": "🐉",
      "cats": ["jeux"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Modèles 3D et pixel art sous licence libre, gratuits pour tous types de projets.","en":"Modèles 3D et pixel art sous licence libre, gratuits pour tous types de projets."}
    },
    {
      "name": "Poly Haven",
      "url": "https://polyhaven.com/",
      "emoji": "🌐",
      "cats": ["jeux","textures","photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Bibliothèque de HDRI, modèles 3D PBR et textures entièrement libres de droits.","en":"Bibliothèque de HDRI, modèles 3D PBR et textures entièrement libres de droits."}
    },
    {
      "name": "ambientCG",
      "url": "https://ambientcg.com/",
      "emoji": "🪨",
      "cats": ["jeux","textures"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection de textures PBR et matériaux CC0 pour shader et rendu 3D.","en":"Collection de textures PBR et matériaux CC0 pour shader et rendu 3D."}
    },
    {
      "name": "Game UI Database",
      "url": "https://www.gameuidatabase.com/",
      "emoji": "🖥️",
      "cats": ["jeux","inspi"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Base de données collaborative d'interfaces de jeux vidéo pour s'inspirer et télécharger des assets UI.","en":"Base de données collaborative d'interfaces de jeux vidéo pour s'inspirer et télécharger des assets UI."}
    },
    {
      "name": "The Spriters Resource",
      "url": "https://www.spriters-resource.com/",
      "emoji": "👾",
      "cats": ["jeux"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Archives de sprites rippés depuis des centaines de jeux vidéo, classés par console et titre.","en":"Archives de sprites rippés depuis des centaines de jeux vidéo, classés par console et titre."}
    },
    {
      "name": "Kenney",
      "url": "https://kenney.nl/",
      "emoji": "🏆",
      "cats": ["jeux","effets","photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Milliers d'assets de jeux gratuits (sprites, sons, modèles 3D, UI) sous licence CC0.","en":"Milliers d'assets de jeux gratuits (sprites, sons, modèles 3D, UI) sous licence CC0."}
    },
    {
      "name": "itch.io — Free Assets",
      "url": "https://itch.io/game-assets/free",
      "emoji": "🎮",
      "cats": ["jeux"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Section assets gratuits d'itch.io : sprites, tilesets, sons et polices pour jeux.","en":"Section assets gratuits d'itch.io : sprites, tilesets, sons et polices pour jeux."}
    },
    {
      "name": "Coverr",
      "url": "https://coverr.co/",
      "emoji": "🎥",
      "cats": ["footage"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Vidéos de stock gratuites en haute résolution pour sites web et présentations.","en":"Vidéos de stock gratuites en haute résolution pour sites web et présentations."}
    },
    {
      "name": "Mazwai",
      "url": "https://mazwai.com/",
      "emoji": "🎞️",
      "cats": ["footage"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Clips vidéo gratuits de qualité cinématographique par des vidéastes indépendants.","en":"Clips vidéo gratuits de qualité cinématographique par des vidéastes indépendants."}
    },
    {
      "name": "StudioAAA Free",
      "url": "https://studioaaa.com/product-category/free/",
      "emoji": "🏛️",
      "cats": ["textures","jeux"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Ressources gratuites — modèles 3D, textures et icônes à télécharger sans frais.","en":"Ressources gratuites — modèles 3D, textures et icônes à télécharger sans frais."}
    },
    {
      "name": "BLK Market Free",
      "url": "https://blkmarket.com/product-category/free/",
      "emoji": "🖤",
      "cats": ["textures","polices","icones"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Section gratuite de BLK Market — polices, icônes et textures librement téléchargeables.","en":"Section gratuite de BLK Market — polices, icônes et textures librement téléchargeables."}
    },
    {
      "name": "Doron Supply Freebies",
      "url": "https://www.doronsupply.com/shop/filter-freebies",
      "emoji": "🌿",
      "cats": ["textures","illustrations"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Ressources graphiques gratuites filtrées — textures, overlays et assets pour créatifs.","en":"Ressources graphiques gratuites filtrées — textures, overlays et assets pour créatifs."}
    },
    {
      "name": "Resourceboy Textures",
      "url": "https://resourceboy.com/textures/",
      "emoji": "🪨",
      "cats": ["textures"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection de textures gratuites pour design graphique et 3D, classées par thème.","en":"Collection de textures gratuites pour design graphique et 3D, classées par thème."}
    },
    {
      "name": "TextureFabrik",
      "url": "https://texturefabrik.com/gallery/",
      "emoji": "🧱",
      "cats": ["textures"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Galerie de textures haute résolution gratuites pour tous types de projets créatifs.","en":"Galerie de textures haute résolution gratuites pour tous types de projets créatifs."}
    },
    {
      "name": "Resourceboy Brushes",
      "url": "https://resourceboy.com/photoshop-brushes/",
      "emoji": "🖌️",
      "cats": ["brushes"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection de brosses gratuites et premium pour Photoshop, classées par style et usage.","en":"Collection de brosses gratuites et premium pour Photoshop, classées par style et usage."}
    },
    {
      "name": "Brusheezy",
      "url": "https://www.brusheezy.com/",
      "emoji": "🎨",
      "cats": ["brushes"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Des milliers de brosses Photoshop et ressources graphiques gratuites à télécharger.","en":"Des milliers de brosses Photoshop et ressources graphiques gratuites à télécharger."}
    },
    {
      "name": "PNGWing",
      "url": "https://www.pngwing.com",
      "emoji": "🖼️",
      "cats": ["png"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Bibliothèque de fichiers PNG à fond transparent gratuits, classés par thème.","en":"Bibliothèque de fichiers PNG à fond transparent gratuits, classés par thème."}
    },
    {
      "name": "ImgBin",
      "url": "https://imgbin.com/",
      "emoji": "🔳",
      "cats": ["png"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection de PNGs HD à fond transparent pour tous types de projets créatifs.","en":"Collection de PNGs HD à fond transparent pour tous types de projets créatifs."}
    },
    {
      "name": "StickPNG",
      "url": "https://www.stickpng.com/",
      "emoji": "🖼️",
      "cats": ["png"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Milliers de PNG transparents sans fond, organisés par catégorie et téléchargeables gratuitement.","en":"Milliers de PNG transparents sans fond, organisés par catégorie et téléchargeables gratuitement."}
    },
    {
      "name": "Space Type Generator",
      "url": "https://spacetypegenerator.com/",
      "emoji": "🌌",
      "cats": ["en-ligne","polices"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générateur en ligne de compositions typographiques spatiales et cinétiques.","en":"Générateur en ligne de compositions typographiques spatiales et cinétiques."}
    },
    {
      "name": "Inclusive Colors",
      "url": "https://www.inclusivecolors.com/",
      "emoji": "♿",
      "cats": ["en-ligne","couleurs"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Simulateur de vision des couleurs pour vérifier l'accessibilité de vos palettes.","en":"Simulateur de vision des couleurs pour vérifier l'accessibilité de vos palettes."}
    },
    {
      "name": "Vectorpea",
      "url": "https://www.vectorpea.com/",
      "emoji": "✒️",
      "cats": ["en-ligne","logiciels"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Éditeur de graphiques vectoriels en ligne gratuit, alternative à Illustrator.","en":"Éditeur de graphiques vectoriels en ligne gratuit, alternative à Illustrator."}
    },
    {
      "name": "Wordmark.it",
      "url": "https://wordmark.it/",
      "emoji": "🔤",
      "cats": ["en-ligne","polices"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Visualisez rapidement votre texte dans toutes les polices installées sur votre système.","en":"Visualisez rapidement votre texte dans toutes les polices installées sur votre système."}
    },
    {
      "name": "WhatTheFont",
      "url": "https://www.myfonts.com/fr/pages/whatthefont",
      "emoji": "🔍",
      "cats": ["en-ligne","polices"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Service d'identification de polices à partir d'une image, par MyFonts.","en":"Service d'identification de polices à partir d'une image, par MyFonts."}
    },
    {
      "name": "Metatags.io",
      "url": "https://metatags.io/",
      "emoji": "🏷️",
      "cats": ["en-ligne","web"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générateur et éditeur de balises meta pour optimiser le partage sur les réseaux sociaux.","en":"Générateur et éditeur de balises meta pour optimiser le partage sur les réseaux sociaux."}
    },
    {
      "name": "FontBrief",
      "url": "https://www.fontbrief.com/",
      "emoji": "📋",
      "cats": ["en-ligne","polices"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Plateforme pour organiser, tester et partager des projets de typographie en équipe.","en":"Plateforme pour organiser, tester et partager des projets de typographie en équipe."}
    },
    {
      "name": "Tooooools",
      "url": "https://www.tooooools.app/",
      "emoji": "🧰",
      "cats": ["en-ligne"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Suite d'outils créatifs en ligne pour designers — couleurs, typographie, icônes et plus.","en":"Suite d'outils créatifs en ligne pour designers — couleurs, typographie, icônes et plus."}
    },
    {
      "name": "Type Tools",
      "url": "https://www.type-tools.com/",
      "emoji": "🔧",
      "cats": ["en-ligne","polices"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection d'utilitaires en ligne pour la gestion et l'inspection de polices.","en":"Collection d'utilitaires en ligne pour la gestion et l'inspection de polices."}
    },
    {
      "name": "CSS Gradient",
      "url": "https://cssgradient.io/",
      "emoji": "🌈",
      "cats": ["web","couleurs"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générateur de dégradés CSS visuel avec prévisualisation en temps réel et copie du code.","en":"Générateur de dégradés CSS visuel avec prévisualisation en temps réel et copie du code."}
    },
    {
      "name": "Haikei",
      "url": "https://haikei.app/",
      "emoji": "🌊",
      "cats": ["web"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générateur de fonds SVG organiques — vagues, blobs, grilles et formes personnalisables.","en":"Générateur de fonds SVG organiques — vagues, blobs, grilles et formes personnalisables."}
    },
    {
      "name": "Animista",
      "url": "https://animista.net/",
      "emoji": "💫",
      "cats": ["web"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Bibliothèque d'animations CSS prêtes à l'emploi, prévisualisables et personnalisables.","en":"Bibliothèque d'animations CSS prêtes à l'emploi, prévisualisables et personnalisables."}
    },
    {
      "name": "Hero Patterns",
      "url": "https://heropatterns.com/",
      "emoji": "✦",
      "cats": ["web","textures"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection de motifs SVG répétables et personnalisables pour fonds de pages web.","en":"Collection de motifs SVG répétables et personnalisables pour fonds de pages web."}
    },
    {
      "name": "Neumorphism.io",
      "url": "https://neumorphism.io/",
      "emoji": "⬜",
      "cats": ["web"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générateur de styles CSS neumorphiques pour créer des interfaces douces et modernes.","en":"Générateur de styles CSS neumorphiques pour créer des interfaces douces et modernes."}
    },
    {
      "name": "CSS Loaders",
      "url": "https://css-loaders.com/",
      "emoji": "⏳",
      "cats": ["web"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection de loaders et spinners CSS purs, copiables en un clic pour vos projets.","en":"Collection de loaders et spinners CSS purs, copiables en un clic pour vos projets."}
    },
    {
      "name": "Patternpad",
      "url": "https://patternpad.com/",
      "emoji": "🔲",
      "cats": ["web","textures"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Créez des motifs géométriques infinis personnalisables, exportables en SVG ou PNG.","en":"Créez des motifs géométriques infinis personnalisables, exportables en SVG ou PNG."}
    },
    {
      "name": "Can I Use",
      "url": "https://caniuse.com/",
      "emoji": "✅",
      "cats": ["web"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Référence de compatibilité des fonctionnalités HTML, CSS et JS selon les navigateurs.","en":"Référence de compatibilité des fonctionnalités HTML, CSS et JS selon les navigateurs."}
    },
    {
      "name": "Saint11 — Pixel Art Tutorials",
      "url": "https://saint11.art/blog/pixel-art-tutorials/",
      "emoji": "🎓",
      "cats": ["tutos","jeux"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Tutoriels pas-à-pas pour apprendre et perfectionner vos techniques de pixel art.","en":"Tutoriels pas-à-pas pour apprendre et perfectionner vos techniques de pixel art."}
    },
    {
      "name": "Sharpen Design",
      "url": "https://sharpen.design/",
      "emoji": "⚔️",
      "cats": ["tutos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générateur de challenges de design pour pratiquer et améliorer vos compétences.","en":"Générateur de challenges de design pour pratiquer et améliorer vos compétences."}
    },
    {
      "name": "Same Energy",
      "url": "https://same.energy/",
      "emoji": "✨",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Moteur de recherche visuel par similarité d'ambiance pour trouver des images inspirantes.","en":"Moteur de recherche visuel par similarité d'ambiance pour trouver des images inspirantes."}
    },
    {
      "name": "Abduzeedo",
      "url": "https://abduzeedo.com/",
      "emoji": "📰",
      "cats": ["inspi","tutos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Blog de design graphique et digital proposant tutoriels, articles et sources d'inspiration.","en":"Blog de design graphique et digital proposant tutoriels, articles et sources d'inspiration."}
    },
    {
      "name": "Lapa Ninja",
      "url": "https://www.lapa.ninja/",
      "emoji": "🥷",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection organisée de landing pages créatives pour puiser des idées de mise en page.","en":"Collection organisée de landing pages créatives pour puiser des idées de mise en page."}
    },
    {
      "name": "Savee",
      "url": "https://savee.it/",
      "emoji": "📌",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Plateforme de bookmarking visuel pour enregistrer et partager des références graphiques.","en":"Plateforme de bookmarking visuel pour enregistrer et partager des références graphiques."}
    },
    {
      "name": "ArtStation",
      "url": "https://www.artstation.com/",
      "emoji": "🎨",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Réseau social professionnel où les artistes 2D/3D exposent leurs portfolios et projets.","en":"Réseau social professionnel où les artistes 2D/3D exposent leurs portfolios et projets."}
    },
    {
      "name": "Identity Designed",
      "url": "https://identitydesigned.com/",
      "emoji": "🏷️",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Cas d'étude sur le branding et l'identité visuelle de marques prestigieuses du monde entier.","en":"Cas d'étude sur le branding et l'identité visuelle de marques prestigieuses du monde entier."}
    },
    {
      "name": "Godly",
      "url": "https://godly.website/",
      "emoji": "⚡",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Sélection des sites web les plus créatifs et innovants du moment.","en":"Sélection des sites web les plus créatifs et innovants du moment."}
    },
    {
      "name": "Land-book",
      "url": "https://land-book.com/",
      "emoji": "📖",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Galerie de landing pages inspirantes pour designers et marketeurs.","en":"Galerie de landing pages inspirantes pour designers et marketeurs."}
    },
    {
      "name": "Collect UI",
      "url": "https://collectui.com/",
      "emoji": "🗂️",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection quotidienne de composants UI inspirants tirés de Dribbble.","en":"Collection quotidienne de composants UI inspirants tirés de Dribbble."}
    },
    {
      "name": "SiteInspire",
      "url": "https://www.siteinspire.com/",
      "emoji": "✦",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Galerie de sites web soigneusement sélectionnés pour leur design remarquable.","en":"Galerie de sites web soigneusement sélectionnés pour leur design remarquable."}
    },
    {
      "name": "Kaboompics",
      "url": "https://kaboompics.com",
      "emoji": "💥",
      "cats": ["photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Photos lifestyle gratuites de haute qualité avec palettes de couleurs associées à chaque photo.","en":"Photos lifestyle gratuites de haute qualité avec palettes de couleurs associées à chaque photo."}
    },
    {
      "name": "Gratisography",
      "url": "https://gratisography.com",
      "emoji": "🎭",
      "cats": ["photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Photos absurdes, décalées et créatives libres de droits par le photographe Ryan McGuire.","en":"Photos absurdes, décalées et créatives libres de droits par le photographe Ryan McGuire."}
    },
    {
      "name": "New Old Stock",
      "url": "https://nos.twnsnd.co",
      "emoji": "🕰️",
      "cats": ["photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Photos vintage issues d'archives publiques, libres de droits sans restriction d'usage.","en":"Photos vintage issues d'archives publiques, libres de droits sans restriction d'usage."}
    },
    {
      "name": "SplitShire",
      "url": "https://www.splitshire.com",
      "emoji": "🌅",
      "cats": ["photos","footage"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Photos et vidéos libres de droits créées par un photographe professionnel.","en":"Photos et vidéos libres de droits créées par un photographe professionnel."}
    },
    {
      "name": "Negative Space",
      "url": "https://negativespace.co",
      "emoji": "⬛",
      "cats": ["photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Photos CC0 orientées minimalisme, espace négatif et compositions épurées.","en":"Photos CC0 orientées minimalisme, espace négatif et compositions épurées."}
    },
    {
      "name": "Stockvault",
      "url": "https://www.stockvault.net",
      "emoji": "🗄️",
      "cats": ["photos","textures"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Archive de photos, illustrations et textures gratuites pour usage personnel et commercial.","en":"Archive de photos, illustrations et textures gratuites pour usage personnel et commercial."}
    },
    {
      "name": "Jay Mantri",
      "url": "https://jaymantri.com",
      "emoji": "🌿",
      "cats": ["photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Photos minimalistes et poétiques libres de droits sous licence CC0.","en":"Photos minimalistes et poétiques libres de droits sous licence CC0."}
    },
    {
      "name": "Morguefile",
      "url": "https://morguefile.com",
      "emoji": "🗂️",
      "cats": ["photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Archives de photos gratuites pour usage commercial sans attribution requise.","en":"Archives de photos gratuites pour usage commercial sans attribution requise."}
    },
    {
      "name": "Skitterphoto",
      "url": "https://skitterphoto.com",
      "emoji": "📸",
      "cats": ["photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Photos libres CC0 — portraits, nature, architecture, lifestyle et scènes urbaines.","en":"Photos libres CC0 — portraits, nature, architecture, lifestyle et scènes urbaines."}
    },
    {
      "name": "Iwaria",
      "url": "https://iwaria.com",
      "emoji": "🌍",
      "cats": ["photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Banque de photos africaines libres de droits représentant la culture et les personnes d'Afrique.","en":"Banque de photos africaines libres de droits représentant la culture et les personnes d'Afrique."}
    },
    {
      "name": "WOCinTech Chat",
      "url": "https://www.wocintechchat.com",
      "emoji": "💻",
      "cats": ["photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Photos de femmes de couleur dans des contextes tech, disponibles sous CC-BY.","en":"Photos de femmes de couleur dans des contextes tech, disponibles sous CC-BY."}
    },
    {
      "name": "Disabled And Here",
      "url": "https://affecttheverb.com/disabledandhere",
      "emoji": "♿",
      "cats": ["photos"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Photos libres de droits représentant des personnes handicapées actives dans leur quotidien.","en":"Photos libres de droits représentant des personnes handicapées actives dans leur quotidien."}
    },
    {
      "name": "Use & Modify",
      "url": "https://usemodify.com",
      "emoji": "✏️",
      "cats": ["polices"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Sélection de polices librement utilisables et modifiables sous licences ouvertes, très curatée.","en":"Sélection de polices librement utilisables et modifiables sous licences ouvertes, très curatée."}
    },
    {
      "name": "Indestructible Type",
      "url": "https://indestructibletype.com",
      "emoji": "💪",
      "cats": ["polices"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Fonderie indépendante offrant des polices de qualité haut de gamme sous licence libre.","en":"Fonderie indépendante offrant des polices de qualité haut de gamme sous licence libre."}
    },
    {
      "name": "The League of Moveable Type",
      "url": "https://www.theleagueofmoveabletype.com",
      "emoji": "🏆",
      "cats": ["polices"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Première fonderie open-source, pionnière des polices libres de qualité éditoriale.","en":"Première fonderie open-source, pionnière des polices libres de qualité éditoriale."}
    },
    {
      "name": "Uncut.wtf",
      "url": "https://uncut.wtf",
      "emoji": "✂️",
      "cats": ["polices"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection de polices d'affichage expressives et gratuites pour projets créatifs audacieux.","en":"Collection de polices d'affichage expressives et gratuites pour projets créatifs audacieux."}
    },
    {
      "name": "Collletttivo",
      "url": "https://collletttivo.it",
      "emoji": "🔬",
      "cats": ["polices"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Bibliothèque expérimentale de polices variables et display libres de droits, très originales.","en":"Bibliothèque expérimentale de polices variables et display libres de droits, très originales."}
    },
    {
      "name": "Tunera Type Foundry",
      "url": "https://www.tunera.xyz",
      "emoji": "🌿",
      "cats": ["polices"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Fonderie indépendante proposant des familles typographiques soignées sous Open Font License.","en":"Fonderie indépendante proposant des familles typographiques soignées sous Open Font License."}
    },
    {
      "name": "Feather Icons",
      "url": "https://feathericons.com",
      "emoji": "🪶",
      "cats": ["icones"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection d'icônes SVG légères, lisibles et élégantes — entièrement open-source.","en":"Collection d'icônes SVG légères, lisibles et élégantes — entièrement open-source."}
    },
    {
      "name": "Remix Icon",
      "url": "https://remixicon.com",
      "emoji": "♾️",
      "cats": ["icones"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Bibliothèque de plus de 2800 icônes vectorielles open-source en style outline et filled.","en":"Bibliothèque de plus de 2800 icônes vectorielles open-source en style outline et filled."}
    },
    {
      "name": "Iconoir",
      "url": "https://iconoir.com",
      "emoji": "🔑",
      "cats": ["icones"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Plus de 1600 icônes SVG open-source avec un style épuré, cohérent et minimaliste.","en":"Plus de 1600 icônes SVG open-source avec un style épuré, cohérent et minimaliste."}
    },
    {
      "name": "Bootstrap Icons",
      "url": "https://icons.getbootstrap.com",
      "emoji": "🅱️",
      "cats": ["icones"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Bibliothèque officielle Bootstrap de plus de 2000 icônes SVG libres et personnalisables.","en":"Bibliothèque officielle Bootstrap de plus de 2000 icônes SVG libres et personnalisables."}
    },
    {
      "name": "Material Symbols",
      "url": "https://fonts.google.com/icons",
      "emoji": "Ⓜ️",
      "cats": ["icones"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Icônes Google Material Design avec variables CSS pour contrôler poids, taille et style.","en":"Icônes Google Material Design avec variables CSS pour contrôler poids, taille et style."}
    },
    {
      "name": "Octicons",
      "url": "https://primer.style/foundations/icons",
      "emoji": "🐙",
      "cats": ["icones"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Icônes SVG open-source créées par GitHub, idéales pour interfaces dev et plateformes web.","en":"Icônes SVG open-source créées par GitHub, idéales pour interfaces dev et plateformes web."}
    },
    {
      "name": "Eva Icons",
      "url": "https://akveo.github.io/eva-icons/",
      "emoji": "💎",
      "cats": ["icones"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Pack de plus de 480 icônes beautifully crafted open-source pour web et mobile.","en":"Pack de plus de 480 icônes beautifully crafted open-source pour web et mobile."}
    },
    {
      "name": "OpenMoji",
      "url": "https://openmoji.org",
      "emoji": "😊",
      "cats": ["icones"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Emojis open-source entièrement éditables en SVG et PNG — projet communautaire et libre.","en":"Emojis open-source entièrement éditables en SVG et PNG — projet communautaire et libre."}
    },
    {
      "name": "Fluent Emoji",
      "url": "https://github.com/microsoft/fluentui-emoji",
      "emoji": "✨",
      "cats": ["icones"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Emojis Microsoft open-source en 3D et flat, disponibles sur GitHub sous MIT.","en":"Emojis Microsoft open-source en 3D et flat, disponibles sur GitHub sous MIT."}
    },
    {
      "name": "Twemoji",
      "url": "https://github.com/jdecked/twemoji",
      "emoji": "🐦",
      "cats": ["icones"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Emojis Twitter open-source compatibles multiplateformes, licence CC-BY 4.0.","en":"Emojis Twitter open-source compatibles multiplateformes, licence CC-BY 4.0."}
    },
    {
      "name": "IRA Design",
      "url": "https://iradesign.io",
      "emoji": "🎨",
      "cats": ["illustrations"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Illustrations à composants modulaires avec dégradés colorés, personnalisables par style.","en":"Illustrations à composants modulaires avec dégradés colorés, personnalisables par style."}
    },
    {
      "name": "Illlustrations.co",
      "url": "https://illlustrations.co",
      "emoji": "🎭",
      "cats": ["illustrations"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Illustrations SVG gratuites déclinées en 7 styles distincts pour tous types de projets.","en":"Illustrations SVG gratuites déclinées en 7 styles distincts pour tous types de projets."}
    },
    {
      "name": "Delesign",
      "url": "https://delesign.com/free-designs/graphics/",
      "emoji": "🎯",
      "cats": ["illustrations","icones"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Bibliothèque d'illustrations et d'icônes gratuites pour usage personnel et commercial.","en":"Bibliothèque d'illustrations et d'icônes gratuites pour usage personnel et commercial."}
    },
    {
      "name": "Pixeltrue",
      "url": "https://www.pixeltrue.com/free-illustrations",
      "emoji": "👾",
      "cats": ["illustrations"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Illustrations vectorielles animées gratuites pour projets web, apps et présentations.","en":"Illustrations vectorielles animées gratuites pour projets web, apps et présentations."}
    },
    {
      "name": "Fresh Folk",
      "url": "https://fresh-folk.com",
      "emoji": "🌻",
      "cats": ["illustrations"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Bibliothèque d'illustrations de personnages diversifiés en style plat, librement utilisables.","en":"Bibliothèque d'illustrations de personnages diversifiés en style plat, librement utilisables."}
    },
    {
      "name": "Stubborn",
      "url": "https://stubborn.fun",
      "emoji": "😤",
      "cats": ["illustrations"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générateur de personnages illustrés avec combinaisons de poses, expressions et styles.","en":"Générateur de personnages illustrés avec combinaisons de poses, expressions et styles."}
    },
    {
      "name": "Khroma",
      "url": "https://www.khroma.co",
      "emoji": "🤖",
      "cats": ["couleurs"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générateur de palettes personnalisé par IA basé sur vos préférences de couleurs apprises.","en":"Générateur de palettes personnalisé par IA basé sur vos préférences de couleurs apprises."}
    },
    {
      "name": "Huemint",
      "url": "https://huemint.com",
      "emoji": "🧠",
      "cats": ["couleurs"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générateur de palettes IA conçu pour les identités de marque et les interfaces digitales.","en":"Générateur de palettes IA conçu pour les identités de marque et les interfaces digitales."}
    },
    {
      "name": "Colormind",
      "url": "https://colormind.io",
      "emoji": "🎨",
      "cats": ["couleurs"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générateur de palettes IA qui apprend les styles des films, œuvres d'art et designs.","en":"Générateur de palettes IA qui apprend les styles des films, œuvres d'art et designs."}
    },
    {
      "name": "ColorSpace",
      "url": "https://mycolor.space",
      "emoji": "🌈",
      "cats": ["couleurs"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générez des palettes harmonieuses depuis une ou deux couleurs de base, avec prévisualisation.","en":"Générez des palettes harmonieuses depuis une ou deux couleurs de base, avec prévisualisation."}
    },
    {
      "name": "Happy Hues",
      "url": "https://www.happyhues.co",
      "emoji": "😊",
      "cats": ["couleurs"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Palettes contextualisées directement sur un vrai design pour voir le rendu en situation réelle.","en":"Palettes contextualisées directement sur un vrai design pour voir le rendu en situation réelle."}
    },
    {
      "name": "shadcn/ui",
      "url": "https://ui.shadcn.com",
      "emoji": "🧩",
      "cats": ["logiciels","web"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Composants React réutilisables, accessibles et personnalisables avec Tailwind CSS.","en":"Composants React réutilisables, accessibles et personnalisables avec Tailwind CSS."}
    },
    {
      "name": "Audacity",
      "url": "https://www.audacityteam.org",
      "emoji": "🎤",
      "cats": ["logiciels","effets"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Éditeur audio multi-piste open-source, gratuit sur toutes plateformes — référence de l'audio.","en":"Éditeur audio multi-piste open-source, gratuit sur toutes plateformes — référence de l'audio."}
    },
    {
      "name": "Transparent Textures",
      "url": "https://www.transparenttextures.com",
      "emoji": "🔳",
      "cats": ["textures","web"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Motifs transparents CSS/PNG personnalisables en couleur et opacité pour fonds web.","en":"Motifs transparents CSS/PNG personnalisables en couleur et opacité pour fonds web."}
    },
    {
      "name": "Subtle Patterns",
      "url": "https://www.toptal.com/designers/subtlepatterns/",
      "emoji": "🌫️",
      "cats": ["textures","web"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Bibliothèque de motifs de fond subtils et discrets, parfaits pour interfaces minimalistes.","en":"Bibliothèque de motifs de fond subtils et discrets, parfaits pour interfaces minimalistes."}
    },
    {
      "name": "Lost and Taken",
      "url": "https://lostandtaken.com",
      "emoji": "🌿",
      "cats": ["textures"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Textures naturelles et organiques haute résolution libres pour tout usage créatif.","en":"Textures naturelles et organiques haute résolution libres pour tout usage créatif."}
    },
    {
      "name": "Mockup Hunt",
      "url": "https://www.mockuphunt.co",
      "emoji": "🔍",
      "cats": ["mockups"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Annuaire de mockups gratuits provenant de diverses sources, actualisé régulièrement.","en":"Annuaire de mockups gratuits provenant de diverses sources, actualisé régulièrement."}
    },
    {
      "name": "CleanPNG",
      "url": "https://www.cleanpng.com",
      "emoji": "🔍",
      "cats": ["png"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Moteur de recherche de PNG transparents HD classés par thème et catégorie.","en":"Moteur de recherche de PNG transparents HD classés par thème et catégorie."}
    },
    {
      "name": "PNGAll",
      "url": "https://www.pngall.com",
      "emoji": "🗂️",
      "cats": ["png"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection de PNG transparents couvrant une large variété de sujets et objets.","en":"Collection de PNG transparents couvrant une large variété de sujets et objets."}
    },
    {
      "name": "PurePNG",
      "url": "https://purepng.com",
      "emoji": "✨",
      "cats": ["png"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Bibliothèque de PNG transparents haute qualité, gratuits et faciles à rechercher.","en":"Bibliothèque de PNG transparents haute qualité, gratuits et faciles à rechercher."}
    },
    {
      "name": "OBS Studio",
      "url": "https://obsproject.com",
      "emoji": "🎥",
      "cats": ["en-ligne","footage"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Logiciel open-source professionnel d'enregistrement et de streaming vidéo, entièrement gratuit.","en":"Logiciel open-source professionnel d'enregistrement et de streaming vidéo, entièrement gratuit."}
    },
    {
      "name": "Ezgif",
      "url": "https://ezgif.com",
      "emoji": "🎞️",
      "cats": ["en-ligne"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Créez, optimisez et éditez des GIFs dans le navigateur — sans inscription ni installation.","en":"Créez, optimisez et éditez des GIFs dans le navigateur — sans inscription ni installation."}
    },
    {
      "name": "UI Avatars",
      "url": "https://ui-avatars.com",
      "emoji": "👤",
      "cats": ["en-ligne","web"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générez des avatars avec initiales personnalisables via URL ou CSS pour vos prototypes.","en":"Générez des avatars avec initiales personnalisables via URL ou CSS pour vos prototypes."}
    },
    {
      "name": "DiceBear",
      "url": "https://dicebear.com",
      "emoji": "🎲",
      "cats": ["en-ligne","web","icones"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générateur d'avatars vectoriels open-source avec des dizaines de styles artistiques distincts.","en":"Générateur d'avatars vectoriels open-source avec des dizaines de styles artistiques distincts."}
    },
    {
      "name": "Lorem Picsum",
      "url": "https://picsum.photos",
      "emoji": "🖼️",
      "cats": ["en-ligne","web"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"API d'images placeholder en haute résolution pour maquettes, prototypes et dev.","en":"API d'images placeholder en haute résolution pour maquettes, prototypes et dev."}
    },
    {
      "name": "HandBrake",
      "url": "https://handbrake.fr",
      "emoji": "🖐️",
      "cats": ["en-ligne","footage"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Encodeur vidéo open-source gratuit pour convertir et compresser tous formats vidéo.","en":"Encodeur vidéo open-source gratuit pour convertir et compresser tous formats vidéo."}
    },
    {
      "name": "uiGradients",
      "url": "https://uigradients.com",
      "emoji": "🌈",
      "cats": ["web","couleurs"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection de dégradés CSS tendance avec code copiable en un clic pour vos projets.","en":"Collection de dégradés CSS tendance avec code copiable en un clic pour vos projets."}
    },
    {
      "name": "WebGradients",
      "url": "https://webgradients.com",
      "emoji": "🎨",
      "cats": ["web","couleurs"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"180 dégradés CSS linéaires librement copiables pour arrière-plans et interfaces.","en":"180 dégradés CSS linéaires librement copiables pour arrière-plans et interfaces."}
    },
    {
      "name": "Blobmaker",
      "url": "https://www.blobmaker.app",
      "emoji": "🫧",
      "cats": ["web"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générateur de formes blob SVG aléatoires pour ajouter organicité et relief à vos designs.","en":"Générateur de formes blob SVG aléatoires pour ajouter organicité et relief à vos designs."}
    },
    {
      "name": "Shape Divider",
      "url": "https://www.shapedivider.app",
      "emoji": "📐",
      "cats": ["web"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Créez des séparateurs de sections SVG stylisés pour transitions de mise en page web.","en":"Créez des séparateurs de sections SVG stylisés pour transitions de mise en page web."}
    },
    {
      "name": "fffuel",
      "url": "https://fffuel.co",
      "emoji": "⚡",
      "cats": ["web"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Suite de générateurs SVG créatifs — confettis, flèches, grilles, mesh et dégradés.","en":"Suite de générateurs SVG créatifs — confettis, flèches, grilles, mesh et dégradés."}
    },
    {
      "name": "Get Waves",
      "url": "https://getwaves.io",
      "emoji": "🌊",
      "cats": ["web"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générateur de vagues SVG personnalisables pour transitions et fonds de pages web.","en":"Générateur de vagues SVG personnalisables pour transitions et fonds de pages web."}
    },
    {
      "name": "Glassmorphism CSS",
      "url": "https://glassmorphism.com",
      "emoji": "🪟",
      "cats": ["web"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générateur d'effets glassmorphism CSS prêts à l'emploi pour interfaces modernes.","en":"Générateur d'effets glassmorphism CSS prêts à l'emploi pour interfaces modernes."}
    },
    {
      "name": "Smooth Shadow",
      "url": "https://shadows.brumm.af",
      "emoji": "🌑",
      "cats": ["web"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Générateur d'ombres CSS douces et réalistes par couches, avec prévisualisation en direct.","en":"Générateur d'ombres CSS douces et réalistes par couches, avec prévisualisation en direct."}
    },
    {
      "name": "CSS-Tricks",
      "url": "https://css-tricks.com",
      "emoji": "🎩",
      "cats": ["tutos","web"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Blog de référence pour CSS, HTML et JavaScript avec guides approfondis et almanach interactif.","en":"Blog de référence pour CSS, HTML et JavaScript avec guides approfondis et almanach interactif."}
    },
    {
      "name": "Codrops",
      "url": "https://tympanus.net/codrops",
      "emoji": "💧",
      "cats": ["tutos","web"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Blog créatif avec tutoriels et démos d'interfaces web innovantes — la référence du CSS avancé.","en":"Blog créatif avec tutoriels et démos d'interfaces web innovantes — la référence du CSS avancé."}
    },
    {
      "name": "FreeCodeCamp",
      "url": "https://www.freecodecamp.org",
      "emoji": "🔥",
      "cats": ["tutos","web"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Plateforme d'apprentissage du développement web entièrement gratuite, open-source et certifiante.","en":"Plateforme d'apprentissage du développement web entièrement gratuite, open-source et certifiante."}
    },
    {
      "name": "Spoon Graphics",
      "url": "https://blog.spoongraphics.co.uk",
      "emoji": "🥄",
      "cats": ["tutos","logiciels"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Blog de tutoriels Illustrator et Photoshop avec freebies et ressources design réguliers.","en":"Blog de tutoriels Illustrator et Photoshop avec freebies et ressources design réguliers."}
    },
    {
      "name": "Motion Café",
      "url": "https://www.motion-cafe.com/",
      "emoji": "☕",
      "cats": ["tutos","motion"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Ressources et tutoriels francophones dédiés au motion design et à After Effects.","en":"Ressources et tutoriels francophones dédiés au motion design et à After Effects."}
    },
    {
      "name": "Muzli",
      "url": "https://muz.li",
      "emoji": "🎵",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Extension navigateur et site d'inspiration design qui agrège le meilleur du web créatif.","en":"Extension navigateur et site d'inspiration design qui agrège le meilleur du web créatif."}
    },
    {
      "name": "UI Movement",
      "url": "https://uimovement.com",
      "emoji": "🔄",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Collection d'animations et d'interactions UI remarquables soumises par la communauté.","en":"Collection d'animations et d'interactions UI remarquables soumises par la communauté."}
    },
    {
      "name": "Designspiration",
      "url": "https://www.designspiration.com",
      "emoji": "🔍",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Moteur de recherche visuel pour s'inspirer en design graphique, branding et illustration.","en":"Moteur de recherche visuel pour s'inspirer en design graphique, branding et illustration."}
    },
    {
      "name": "Httpster",
      "url": "https://httpster.net",
      "emoji": "🌐",
      "cats": ["inspi"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Galerie de sites web inspirants au design fort, triés par catégorie et style.","en":"Galerie de sites web inspirants au design fort, triés par catégorie et style."}
    },
    {
      "name": "Mixkit Templates",
      "url": "https://mixkit.co/free-after-effects-templates/",
      "emoji": "🎬",
      "cats": ["motion"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Templates After Effects, Premiere Pro et DaVinci Resolve gratuits pour créateurs de contenu.","en":"Templates After Effects, Premiere Pro et DaVinci Resolve gratuits pour créateurs de contenu."}
    },
    {
      "name": "ActionVFX Free",
      "url": "https://www.actionvfx.com/collections/free-vfx",
      "emoji": "💥",
      "cats": ["motion"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Éléments VFX professionnels gratuits — feux, fumée, explosions et particules.","en":"Éléments VFX professionnels gratuits — feux, fumée, explosions et particules."}
    },
    {
      "name": "FreshLUTs",
      "url": "https://freshluts.com",
      "emoji": "🎨",
      "cats": ["motion"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"LUTs de color grading gratuits pour Premiere, DaVinci Resolve, FCPX et Lightroom.","en":"LUTs de color grading gratuits pour Premiere, DaVinci Resolve, FCPX et Lightroom."}
    },
    {
      "name": "Life of Vids",
      "url": "https://www.lifeofvids.com",
      "emoji": "🎬",
      "cats": ["footage","motion"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Vidéos de stock gratuites sous licence CC0 pour usage commercial sans attribution requise.","en":"Vidéos de stock gratuites sous licence CC0 pour usage commercial sans attribution requise."}
    },
    {
      "name": "Dareful",
      "url": "https://dareful.com",
      "emoji": "🌅",
      "cats": ["footage"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Vidéos stock 4K sous licence CC0 — paysages, architectures et scènes urbaines cinématographiques.","en":"Vidéos stock 4K sous licence CC0 — paysages, architectures et scènes urbaines cinématographiques."}
    },
    {
      "name": "Velosofy",
      "url": "https://www.velosofy.com",
      "emoji": "⚡",
      "cats": ["motion"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Templates After Effects et intro logo gratuits pour créateurs de contenu YouTube.","en":"Templates After Effects et intro logo gratuits pour créateurs de contenu YouTube."}
    },
    {
      "name": "Blendswap",
      "url": "https://www.blendswap.com",
      "emoji": "🔀",
      "cats": ["3d","jeux"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Communauté de partage de modèles Blender 3D sous différentes licences Creative Commons.","en":"Communauté de partage de modèles Blender 3D sous différentes licences Creative Commons."}
    },
    {
      "name": "KitBash3D Cargo",
      "url": "https://cargo.kitbash3d.com",
      "emoji": "📦",
      "cats": ["3d"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": true,
      "desc": {"fr":"Plateforme gratuite de KitBash3D avec des assets 3D de qualité studio hollywoodien.","en":"Plateforme gratuite de KitBash3D avec des assets 3D de qualité studio hollywoodien."}
    },
    {
      "name": "Wikimedia Commons",
      "url": "https://commons.wikimedia.org/",
      "emoji": "📚",
      "cats": ["photos","illustrations","footage","effets"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Médiathèque libre avec plus de 100M d'images, vidéos et sons sous licences libres ou domaine public.","en":"Médiathèque libre avec plus de 100M d'images, vidéos et sons sous licences libres ou domaine public."}
    },
    {
      "name": "NASA Image Library",
      "url": "https://images.nasa.gov/",
      "emoji": "🚀",
      "cats": ["photos","footage","effets"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Banque officielle d'images, vidéos et sons de la NASA — entièrement domaine public.","en":"Banque officielle d'images, vidéos et sons de la NASA — entièrement domaine public."}
    },
    {
      "name": "The Met Open Access",
      "url": "https://www.metmuseum.org/art/collection/search#!?showOnly=openAccess",
      "emoji": "🖼️",
      "cats": ["photos","illustrations","inspi"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Plus de 490 000 œuvres d'art du Metropolitan Museum sous licence CC0 — peintures, gravures, objets.","en":"Plus de 490 000 œuvres d'art du Metropolitan Museum sous licence CC0 — peintures, gravures, objets."}
    },
    {
      "name": "Smithsonian Open Access",
      "url": "https://www.si.edu/openaccess",
      "emoji": "🏛️",
      "cats": ["photos","illustrations"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"4,5M d'images du Smithsonian (musées, archives) en CC0 — art, sciences, histoire.","en":"4,5M d'images du Smithsonian (musées, archives) en CC0 — art, sciences, histoire."}
    },
    {
      "name": "The Public Domain Review",
      "url": "https://publicdomainreview.org/",
      "emoji": "📜",
      "cats": ["photos","illustrations","inspi"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Curation érudite d'œuvres et d'images du domaine public — illustrations vintage, gravures, photos historiques.","en":"Curation érudite d'œuvres et d'images du domaine public — illustrations vintage, gravures, photos historiques."}
    },
    {
      "name": "Pixelorama",
      "url": "https://orama-interactive.itch.io/pixelorama",
      "emoji": "🎨",
      "cats": ["jeux","en-ligne"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Éditeur de pixel art et d'animations open-source dans Godot — alternative gratuite et complète à Aseprite.","en":"Éditeur de pixel art et d'animations open-source dans Godot — alternative gratuite et complète à Aseprite."}
    },
    {
      "name": "Excalidraw",
      "url": "https://excalidraw.com/",
      "emoji": "✏️",
      "cats": ["en-ligne","logiciels"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Outil de dessin et de schémas type tableau blanc, open-source, gratuit, sans compte.","en":"Outil de dessin et de schémas type tableau blanc, open-source, gratuit, sans compte."}
    },
    {
      "name": "draw.io",
      "url": "https://www.drawio.com/",
      "emoji": "📊",
      "cats": ["en-ligne","web"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Diagrammes, flowcharts et wireframes en ligne — open-source, gratuit, sauvegarde locale ou cloud.","en":"Diagrammes, flowcharts et wireframes en ligne — open-source, gratuit, sauvegarde locale ou cloud."}
    },
    {
      "name": "tldraw",
      "url": "https://www.tldraw.com/",
      "emoji": "🖍️",
      "cats": ["en-ligne","logiciels"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Tableau blanc collaboratif minimaliste, open-source — esquisse rapide, schémas, partage instantané.","en":"Tableau blanc collaboratif minimaliste, open-source — esquisse rapide, schémas, partage instantané."}
    },
    {
      "name": "MDN Web Docs",
      "url": "https://developer.mozilla.org/",
      "emoji": "📖",
      "cats": ["tutos","web"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Documentation web de référence par Mozilla — HTML, CSS, JS, accessibilité, performance.","en":"Documentation web de référence par Mozilla — HTML, CSS, JS, accessibilité, performance."}
    },
    {
      "name": "Devicon",
      "url": "https://devicon.dev/",
      "emoji": "💻",
      "cats": ["icones","web"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Icônes des langages, frameworks et outils dev — open-source (MIT), parfait pour CV et portfolios.","en":"Icônes des langages, frameworks et outils dev — open-source (MIT), parfait pour CV et portfolios."}
    },
    {
      "name": "Tailwind CSS",
      "url": "https://tailwindcss.com/",
      "emoji": "🌬️",
      "cats": ["web"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Framework CSS utility-first ultra populaire, open-source, doc et playground gratuits.","en":"Framework CSS utility-first ultra populaire, open-source, doc et playground gratuits."}
    },
    {
      "name": "Open Props",
      "url": "https://open-props.style/",
      "emoji": "🎚️",
      "cats": ["couleurs","web","logiciels"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Custom properties CSS open-source pour design systems rapides — couleurs, typographies, ombres.","en":"Custom properties CSS open-source pour design systems rapides — couleurs, typographies, ombres."}
    },
    {
      "name": "Sonniss GameAudioGDC",
      "url": "https://sonniss.com/gameaudiogdc",
      "emoji": "🔊",
      "cats": ["effets","jeux"],
      "license": "outil",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Packs gratuits annuels d'effets sonores HQ pour devs de jeux — usage commercial libre.","en":"Packs gratuits annuels d'effets sonores HQ pour devs de jeux — usage commercial libre."}
    },
    {
      "name": "OpenGameArt 3D",
      "url": "https://opengameart.org/art-search-advanced?field_art_type_tid%5B%5D=10",
      "emoji": "🗿",
      "cats": ["3d","jeux"],
      "license": "opensource",
      "licenseName": "(provisoire)",
      "account": false,
      "desc": {"fr":"Modèles 3D libres (CC) pour développeurs de jeux — section dédiée d'OpenGameArt.","en":"Modèles 3D libres (CC) pour développeurs de jeux — section dédiée d'OpenGameArt."}
    }
  ]
};
