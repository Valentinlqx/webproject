const RESOURCES_DATA = {
  "categories": [
    {
      "id": "images",
      "label": "🖼️ Images",
      "color": "#3ecfcf"
    },
    {
      "id": "polices",
      "label": "🔤 Polices",
      "color": "#6c63ff"
    },
    {
      "id": "icones",
      "label": "✦ Icônes",
      "color": "#ff6b6b"
    },
    {
      "id": "illustrations",
      "label": "✏️ Illustrations",
      "color": "#ffd93d"
    },
    {
      "id": "couleurs",
      "label": "🎨 Couleurs",
      "color": "#ff9f43"
    },
    {
      "id": "design",
      "label": "⚡ Design",
      "color": "#48dbfb"
    },
    {
      "id": "sons",
      "label": "🎵 Sons",
      "color": "#ff6b81"
    },
    {
      "id": "musiques",
      "label": "🎼 Musiques",
      "color": "#6ab04c"
    },
    {
      "id": "mockups",
      "label": "📦 Mockups",
      "color": "#a29bfe"
    },
    {
      "id": "jeux",
      "label": "🎮 Jeux Vidéos",
      "color": "#78e08f"
    },
    {
      "id": "web",
      "label": "🌐 Web",
      "color": "#fd9644"
    },
    {
      "id": "video",
      "label": "🎬 Vidéo",
      "color": "#e17055"
    },
    {
      "id": "textures",
      "label": "🪨 Textures",
      "color": "#b8860b"
    },
    {
      "id": "brushes",
      "label": "🖌️ Brushes",
      "color": "#c0392b"
    },
    {
      "id": "png",
      "label": "🔳 PNG",
      "color": "#7f8c8d"
    },
    {
      "id": "ia",
      "label": "🤖 Outils IA",
      "color": "#8e44ad"
    },
    {
      "id": "outils",
      "label": "🛠️ Outils",
      "color": "#00b894"
    },
    {
      "id": "tutos",
      "label": "📖 Tutos",
      "color": "#fdcb6e"
    },
    {
      "id": "inspi",
      "label": "💡 Inspiration",
      "color": "#fd79a8"
    },
    {
      "id": "motion",
      "label": "🎬 Motion Design",
      "color": "#e84393"
    },
    {
      "id": "3d",
      "label": "🧊 3D Assets",
      "color": "#00cec9"
    },
    {
      "id": "opensource",
      "label": "🌱 Open Source",
      "color": "#27ae60"
    }
  ],
  "resources": [
    {
      "name": "Unsplash",
      "desc": "Photos haute résolution gratuites et libres de droits, contributées par une communauté mondiale.",
      "url": "https://unsplash.com",
      "cats": [
        "images"
      ],
      "emoji": "🌄",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Pexels",
      "desc": "Photos et vidéos HD gratuites par une communauté mondiale de créateurs talentueux.",
      "url": "https://pexels.com",
      "cats": [
        "images",
        "video"
      ],
      "emoji": "📷",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Pixabay",
      "desc": "Plus d'un million d'images, vidéos, sons et musiques libres de droits sous licence CC0.",
      "url": "https://pixabay.com",
      "cats": [
        "images",
        "video",
        "sons",
        "musiques"
      ],
      "emoji": "🖼️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Pixabay Audio",
      "desc": "Section audio de Pixabay : musiques et effets sonores spécifiquement classés et filtrables.",
      "url": "https://pixabay.com/music/",
      "cats": [
        "sons",
        "musiques"
      ],
      "emoji": "🎶",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "StockSnap",
      "desc": "Des centaines de nouvelles photos libres de droits ajoutées chaque semaine.",
      "url": "https://stocksnap.io",
      "cats": [
        "images"
      ],
      "emoji": "📸",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Burst",
      "desc": "Photos gratuites pour créateurs et entrepreneurs, par Shopify.",
      "url": "https://burst.shopify.com",
      "cats": [
        "images"
      ],
      "emoji": "⚡",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Life of Pix",
      "desc": "Photos haute résolution libres de droits pour usage personnel et commercial.",
      "url": "https://www.lifeofpix.com",
      "cats": [
        "images"
      ],
      "emoji": "🌿",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Nappy",
      "desc": "Photographies authentiques de personnes de couleur, gratuites pour usage commercial.",
      "url": "https://nappy.co/",
      "cats": [
        "images"
      ],
      "emoji": "🤎",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Rawpixel Public Domain",
      "desc": "Images et illustrations du domaine public à télécharger librement pour tout usage.",
      "url": "https://www.rawpixel.com/public-domain",
      "cats": [
        "images",
        "illustrations"
      ],
      "emoji": "🏛️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Public.work",
      "desc": "Collection d'images sous licence CC0 pour projets créatifs, recherchables facilement.",
      "url": "https://public.work/",
      "cats": [
        "images"
      ],
      "emoji": "🔍",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Freepik",
      "desc": "Vecteurs, photos, illustrations et PSD gratuits pour tous types de projets créatifs.",
      "url": "https://www.freepik.com/",
      "cats": [
        "images",
        "illustrations",
        "icones"
      ],
      "emoji": "🎯",
      "status": "freemium"
    },
    {
      "name": "ISO Republic",
      "desc": "Photos, vidéos et pistes audio gratuites et libres de droits pour usage commercial.",
      "url": "https://isorepublic.com/",
      "cats": [
        "images",
        "video",
        "sons"
      ],
      "emoji": "🌐",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Toools Stock Photos",
      "desc": "Liste d'agrégateurs de sites de photos et vidéos libres de droits sélectionnés.",
      "url": "https://www.toools.design/free-stock-photo-and-video-websites",
      "cats": [
        "images",
        "video"
      ],
      "emoji": "📋",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Google Fonts",
      "desc": "Bibliothèque de plus de 1400 polices open-source, directement intégrables en CSS.",
      "url": "https://fonts.google.com",
      "cats": [
        "polices",
        "opensource"
      ],
      "emoji": "🔡",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Font Squirrel",
      "desc": "Polices libres de droits sélectionnées à la main, toutes utilisables commercialement.",
      "url": "https://www.fontsquirrel.com",
      "cats": [
        "polices"
      ],
      "emoji": "🐿️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "DaFont",
      "desc": "Des milliers de polices gratuites organisées par style et catégorie.",
      "url": "https://www.dafont.com/fr/",
      "cats": [
        "polices"
      ],
      "emoji": "✒️",
      "status": "freemium",
      "noaccount": true
    },
    {
      "name": "Fontesk",
      "desc": "Polices gratuites soigneusement sélectionnées pour usage personnel et commercial.",
      "url": "https://fontesk.com",
      "cats": [
        "polices"
      ],
      "emoji": "✍️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "1001 Fonts",
      "desc": "Large collection de polices gratuites pour tous les projets créatifs.",
      "url": "https://www.1001fonts.com",
      "cats": [
        "polices"
      ],
      "emoji": "📝",
      "status": "freemium",
      "noaccount": true
    },
    {
      "name": "Free Faces",
      "desc": "Galerie de polices gratuites et open-source avec aperçus dynamiques et téléchargement direct.",
      "url": "https://www.freefaces.gallery/",
      "cats": [
        "polices",
        "opensource"
      ],
      "emoji": "🖼️",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Fontshare",
      "desc": "Bibliothèque collaborative de polices gratuites pour projets personnels et commerciaux.",
      "url": "https://www.fontshare.com/",
      "cats": [
        "polices"
      ],
      "emoji": "🤝",
      "status": "free"
    },
    {
      "name": "Dirtyline Studio",
      "desc": "Collection de polices originales et créatives proposées par Dirtyline Studio.",
      "url": "https://dirtylinestudio.com/",
      "cats": [
        "polices"
      ],
      "emoji": "🖊️",
      "status": "freemium",
      "noaccount": true
    },
    {
      "name": "Velvetyne",
      "desc": "Fonderie en ligne offrant des polices libres et expérimentales sous Open Font License.",
      "url": "https://velvetyne.fr/",
      "cats": [
        "polices",
        "opensource"
      ],
      "emoji": "🧪",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Open Foundry",
      "desc": "Plateforme de polices open-source sélectionnées pour leur qualité et leur diversité.",
      "url": "https://open-foundry.com/fonts",
      "cats": [
        "polices",
        "opensource"
      ],
      "emoji": "🔓",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Toools Font Library",
      "desc": "Bibliothèque de ressources et d'inspirations typographiques pour designers.",
      "url": "https://www.toools.design/font-library-and-inspiration",
      "cats": [
        "polices"
      ],
      "emoji": "📚",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "BeFonts",
      "desc": "Annuaire de polices gratuites classées par style et popularité, téléchargement libre.",
      "url": "https://befonts.com/",
      "cats": [
        "polices"
      ],
      "emoji": "🅱️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "FontJoy",
      "desc": "Outil IA d'aide à la création de paires de polices harmonieuses en un clic.",
      "url": "https://fontjoy.com/",
      "cats": [
        "polices",
        "outils"
      ],
      "emoji": "🎯",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Pangram Pangram",
      "desc": "Sélection de polices modernes et stylisées avec aperçus en contexte réel.",
      "url": "https://pangrampangram.com/",
      "cats": [
        "polices"
      ],
      "emoji": "✦",
      "status": "freemium",
      "noaccount": true
    },
    {
      "name": "Unblast Fonts",
      "desc": "Collection de polices gratuites de qualité professionnelle pour tout usage créatif.",
      "url": "https://unblast.com/fonts/",
      "cats": [
        "polices"
      ],
      "emoji": "💥",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Resourceboy Fonts",
      "desc": "Vaste section de polices gratuites au sein de la plateforme Resourceboy.",
      "url": "https://resourceboy.com/fonts/",
      "cats": [
        "polices"
      ],
      "emoji": "📦",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Fonts In Use",
      "desc": "Base de données de polices identifiées dans le design et la publicité, avec études de cas.",
      "url": "https://fontsinuse.com/",
      "cats": [
        "polices",
        "inspi"
      ],
      "emoji": "🔍",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Text Studio",
      "desc": "Outils en ligne pour tester, combiner et affiner des polices dans vos projets.",
      "url": "https://www.textstudio.com/",
      "cats": [
        "polices",
        "outils"
      ],
      "emoji": "🎨",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Heroicons",
      "desc": "Icônes SVG open-source créées par l'équipe de Tailwind CSS.",
      "url": "https://heroicons.com",
      "cats": [
        "icones",
        "opensource"
      ],
      "emoji": "⚡",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Lucide",
      "desc": "Collection d'icônes open-source cohérente et élégante, fork de Feather Icons.",
      "url": "https://lucide.dev",
      "cats": [
        "icones",
        "opensource"
      ],
      "emoji": "🌟",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Flaticon",
      "desc": "La plus grande base de données d'icônes vectorielles gratuites — des millions d'icônes.",
      "url": "https://www.flaticon.com",
      "cats": [
        "icones"
      ],
      "emoji": "🎯",
      "status": "freemium"
    },
    {
      "name": "Icons8",
      "desc": "Icônes, illustrations, photos et musique réunis dans un seul endroit.",
      "url": "https://icons8.com",
      "cats": [
        "icones",
        "illustrations"
      ],
      "emoji": "🎨",
      "status": "freemium"
    },
    {
      "name": "SVG Repo",
      "desc": "Collection massive de plus de 500 000 icônes SVG gratuites et open-source.",
      "url": "https://www.svgrepo.com",
      "cats": [
        "icones"
      ],
      "emoji": "🔷",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Tabler Icons",
      "desc": "Plus de 4000 icônes SVG pixel-perfect, open-source et entièrement personnalisables.",
      "url": "https://tabler-icons.io",
      "cats": [
        "icones",
        "opensource"
      ],
      "emoji": "📐",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Phosphor Icons",
      "desc": "Famille d'icônes flexible avec 6 styles différents pour chaque icône.",
      "url": "https://phosphoricons.com",
      "cats": [
        "icones",
        "opensource"
      ],
      "emoji": "🧪",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Toools Icon Libraries",
      "desc": "Sélection de bibliothèques d'icônes open-source gratuites, triées et commentées.",
      "url": "https://www.toools.design/free-open-source-icon-libraries",
      "cats": [
        "icones"
      ],
      "emoji": "📚",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "The Noun Project",
      "desc": "Plateforme communautaire de millions d'icônes et pictogrammes pour tous usages.",
      "url": "https://thenounproject.com/",
      "cats": [
        "icones"
      ],
      "emoji": "🔠",
      "status": "freemium"
    },
    {
      "name": "Ionicons",
      "desc": "Ensemble d'icônes vectorielles pour applications mobiles et web, maintenu par Ionic.",
      "url": "https://ionic.io/ionicons",
      "cats": [
        "icones",
        "opensource"
      ],
      "emoji": "⚡",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Simple Icons",
      "desc": "Icônes SVG de marques et logos populaires, libres pour tout usage web.",
      "url": "https://simpleicons.org/",
      "cats": [
        "icones",
        "opensource"
      ],
      "emoji": "🏷️",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Iconify",
      "desc": "Plateforme unifiant des dizaines de sets d'icônes open-source, utilisable en CSS ou JS.",
      "url": "https://icon-sets.iconify.design",
      "cats": [
        "icones",
        "opensource"
      ],
      "emoji": "🔗",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Iconduck",
      "desc": "Annuaire d'icônes gratuites avec recherche par style et filtre par licence.",
      "url": "https://iconduck.com/",
      "cats": [
        "icones"
      ],
      "emoji": "🦆",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Glyphter",
      "desc": "Créez vos propres fontes d'icônes personnalisées à partir de SVGs importés.",
      "url": "https://www.glyphter.com/",
      "cats": [
        "icones",
        "outils"
      ],
      "emoji": "✏️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Reshot",
      "desc": "Banque d'icônes et de photos gratuites soigneusement sélectionnées pour projets variés.",
      "url": "https://www.reshot.com/",
      "cats": [
        "icones",
        "images",
        "illustrations"
      ],
      "emoji": "📷",
      "status": "free"
    },
    {
      "name": "unDraw",
      "desc": "Illustrations SVG open-source personnalisables en couleur pour tous vos projets.",
      "url": "https://undraw.co",
      "cats": [
        "illustrations",
        "opensource"
      ],
      "emoji": "🎨",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Storyset",
      "desc": "Illustrations animées gratuites et personnalisables pour sites web et applications.",
      "url": "https://storyset.com",
      "cats": [
        "illustrations"
      ],
      "emoji": "📖",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Open Doodles",
      "desc": "Croquis et doodles libres de droits dans un style minimaliste et moderne.",
      "url": "https://opendoodles.com",
      "cats": [
        "illustrations",
        "opensource"
      ],
      "emoji": "✏️",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Blush",
      "desc": "Illustrations personnalisables créées par des artistes indépendants du monde entier.",
      "url": "https://blush.design",
      "cats": [
        "illustrations"
      ],
      "emoji": "🌸",
      "status": "freemium"
    },
    {
      "name": "Humaaans",
      "desc": "Mix-and-match illustrations de personnes entièrement modulables, par Pablo Stanley.",
      "url": "https://www.humaaans.com",
      "cats": [
        "illustrations",
        "opensource"
      ],
      "emoji": "👥",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "DrawKit",
      "desc": "Illustrations vectorielles gratuites pour designers et startups.",
      "url": "https://www.drawkit.com",
      "cats": [
        "illustrations"
      ],
      "emoji": "🖌️",
      "status": "freemium"
    },
    {
      "name": "Icons8 Mega Creator",
      "desc": "Outil web pour créer des scènes personnalisées avec des illustrations modulaires et des icônes.",
      "url": "https://icons8.com/mega-creator",
      "cats": [
        "illustrations",
        "outils"
      ],
      "emoji": "🎭",
      "status": "freemium"
    },
    {
      "name": "Open Peeps",
      "desc": "Pack de personnages dessinés à la main et entièrement modifiables, par Pablo Stanley.",
      "url": "https://openpeeps.com/",
      "cats": [
        "illustrations",
        "opensource"
      ],
      "emoji": "🙋",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Storytale",
      "desc": "Générateur d'illustrations scénarisées pour narrations digitales et présentations.",
      "url": "https://storytale.io/",
      "cats": [
        "illustrations"
      ],
      "emoji": "📚",
      "status": "freemium"
    },
    {
      "name": "Absurd Design",
      "desc": "Illustrations absurdes et artistiques pour rendre vos designs uniques et mémorables.",
      "url": "https://absurd.design/",
      "cats": [
        "illustrations"
      ],
      "emoji": "🌀",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Lukasz Adam",
      "desc": "Série d'illustrations minimalistes et abstraites gratuites créées par Lukasz Adam.",
      "url": "https://lukaszadam.com/illustrations",
      "cats": [
        "illustrations"
      ],
      "emoji": "◻️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Internet Archive Book Images",
      "desc": "Collection d'images d'archives libres de droits issues de livres anciens numérisés.",
      "url": "https://www.flickr.com/photos/internetarchivebookimages/",
      "cats": [
        "illustrations",
        "images"
      ],
      "emoji": "📖",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Coolors",
      "desc": "Générateur de palettes ultra-rapide — appuyez sur espace pour générer une nouvelle palette.",
      "url": "https://coolors.co",
      "cats": [
        "couleurs"
      ],
      "emoji": "🎨",
      "status": "freemium",
      "noaccount": true
    },
    {
      "name": "Adobe Color",
      "desc": "Créez, explorez et partagez des palettes basées sur les règles de théorie des couleurs.",
      "url": "https://color.adobe.com",
      "cats": [
        "couleurs"
      ],
      "emoji": "🌈",
      "status": "free"
    },
    {
      "name": "Color Hunt",
      "desc": "Palettes de couleurs tendance sélectionnées par une communauté de créateurs.",
      "url": "https://colorhunt.co",
      "cats": [
        "couleurs"
      ],
      "emoji": "🎯",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Realtime Colors",
      "desc": "Visualisez votre palette de couleurs sur un vrai site web, en temps réel.",
      "url": "https://www.realtimecolors.com",
      "cats": [
        "couleurs"
      ],
      "emoji": "⚡",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "UI Colors",
      "desc": "Générez des échelles de teintes Tailwind-ready depuis n'importe quelle couleur de base.",
      "url": "https://uicolors.app",
      "cats": [
        "couleurs"
      ],
      "emoji": "🔢",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Resourceboy Gradients",
      "desc": "Collection de dégradés gratuits à importer facilement dans Photoshop.",
      "url": "https://resourceboy.com/photoshop-gradients/",
      "cats": [
        "couleurs"
      ],
      "emoji": "🎨",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Gradient Hunt",
      "desc": "Bibliothèque interactive de dégradés CSS prêts à l'emploi, copiables en un clic.",
      "url": "https://gradienthunt.com/",
      "cats": [
        "couleurs"
      ],
      "emoji": "🌈",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Paletton",
      "desc": "Outil avancé de théorie des couleurs pour construire des palettes harmonieuses.",
      "url": "https://paletton.com/",
      "cats": [
        "couleurs"
      ],
      "emoji": "🔵",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Open Color",
      "desc": "Palette de couleurs open-source optimisée pour l'UI, disponible en CSS, Sass et plus.",
      "url": "https://yeun.github.io/open-color/",
      "cats": [
        "couleurs",
        "opensource"
      ],
      "emoji": "🎨",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Figma",
      "desc": "Outil de design collaboratif dans le navigateur, avec un plan gratuit très généreux.",
      "url": "https://figma.com",
      "cats": [
        "design"
      ],
      "emoji": "✦",
      "status": "freemium"
    },
    {
      "name": "Penpot",
      "desc": "Alternative open-source à Figma, 100% gratuite et auto-hébergeable.",
      "url": "https://penpot.app",
      "cats": [
        "design",
        "opensource"
      ],
      "emoji": "🐾",
      "status": "free",
      "opensource": true
    },
    {
      "name": "Canva",
      "desc": "Créez des designs professionnels en quelques minutes avec des centaines de modèles gratuits.",
      "url": "https://canva.com",
      "cats": [
        "design"
      ],
      "emoji": "🖼️",
      "status": "freemium"
    },
    {
      "name": "Photopea",
      "desc": "Éditeur photo avancé dans le navigateur, compatible Photoshop — totalement gratuit.",
      "url": "https://www.photopea.com",
      "cats": [
        "design",
        "outils"
      ],
      "emoji": "🖊️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Remove.bg",
      "desc": "Supprimez automatiquement l'arrière-plan de n'importe quelle photo en quelques secondes.",
      "url": "https://www.remove.bg",
      "cats": [
        "design",
        "outils"
      ],
      "emoji": "✂️",
      "status": "freemium"
    },
    {
      "name": "Squoosh",
      "desc": "Compressez et convertissez vos images directement dans le navigateur, sans perte de qualité.",
      "url": "https://squoosh.app",
      "cats": [
        "design",
        "outils",
        "opensource"
      ],
      "emoji": "🗜️",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "GIMP",
      "desc": "Éditeur d'images open-source et gratuit, alternative puissante à Photoshop.",
      "url": "https://www.gimp.org/",
      "cats": [
        "design",
        "opensource"
      ],
      "emoji": "🐶",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Krita",
      "desc": "Application de peinture numérique open-source, idéale pour l'illustration et le concept art.",
      "url": "https://krita.org/",
      "cats": [
        "design",
        "illustrations",
        "opensource"
      ],
      "emoji": "🖌️",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Inkscape",
      "desc": "Éditeur de graphiques vectoriels open-source, alternative gratuite à Illustrator.",
      "url": "https://inkscape.org/",
      "cats": [
        "design",
        "opensource"
      ],
      "emoji": "✒️",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Lunacy",
      "desc": "Logiciel de design gratuit pour Windows/Mac/Linux, compatible fichiers Figma et Sketch.",
      "url": "https://icons8.com/lunacy",
      "cats": [
        "design"
      ],
      "emoji": "🌙",
      "status": "free"
    },
    {
      "name": "ClipDrop",
      "desc": "Suite d'outils IA pour retoucher, recadrer et améliorer vos visuels en un clic.",
      "url": "https://clipdrop.co/",
      "cats": [
        "design",
        "ia"
      ],
      "emoji": "✂️",
      "status": "freemium"
    },
    {
      "name": "Freesound",
      "desc": "Bibliothèque collaborative de sons et effets sonores libres de droits, par la communauté.",
      "url": "https://freesound.org",
      "cats": [
        "sons"
      ],
      "emoji": "🔊",
      "status": "free"
    },
    {
      "name": "Mixkit",
      "desc": "Sons, effets sonores, musiques et vidéos stock 100% gratuits et libres pour vos créations.",
      "url": "https://mixkit.co",
      "cats": [
        "sons",
        "musiques",
        "video"
      ],
      "emoji": "🎵",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "ZapSplat",
      "desc": "Plus de 100 000 effets sonores et musiques libres de droits, téléchargements illimités.",
      "url": "https://www.zapsplat.com",
      "cats": [
        "sons"
      ],
      "emoji": "⚡",
      "status": "freemium"
    },
    {
      "name": "Free Music Archive",
      "desc": "Archive de musique libre, légale et haute qualité pour projets créatifs.",
      "url": "https://freemusicarchive.org",
      "cats": [
        "sons",
        "musiques"
      ],
      "emoji": "🎸",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "SoundJay",
      "desc": "Bibliothèque d'effets sonores et bruitages gratuits pour projets multimédias.",
      "url": "https://www.soundjay.com/",
      "cats": [
        "sons"
      ],
      "emoji": "🔔",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Big Sound Bank",
      "desc": "Collection d'effets sonores organisés par catégorie, téléchargeables gratuitement.",
      "url": "https://bigsoundbank.com/categories.html",
      "cats": [
        "sons"
      ],
      "emoji": "🏦",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "ccMixter",
      "desc": "Communauté de musique sous licence Creative Commons — remix, samples et morceaux complets.",
      "url": "https://ccmixter.org/",
      "cats": [
        "sons",
        "musiques"
      ],
      "emoji": "🎛️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Incompetech",
      "desc": "Bibliothèque de musiques libres de droits composées par Kevin MacLeod, classées par genre.",
      "url": "https://incompetech.com/music/royalty-free/music.html",
      "cats": [
        "musiques"
      ],
      "emoji": "🎹",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "NCS",
      "desc": "NoCopyrightSounds : musiques électroniques gratuites pour créateurs de contenus YouTube.",
      "url": "https://ncs.io/",
      "cats": [
        "musiques"
      ],
      "emoji": "⚡",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Uppbeat",
      "desc": "Collection de musiques libres de droits avec filtres par ambiance, genre et tempo.",
      "url": "https://uppbeat.io/",
      "cats": [
        "musiques"
      ],
      "emoji": "🎚️",
      "status": "freemium"
    },
    {
      "name": "Scott Buckley",
      "desc": "Catalogue de musiques orchestrales et ambiantes composées par Scott Buckley, gratuites.",
      "url": "https://www.scottbuckley.com.au/library/",
      "cats": [
        "musiques"
      ],
      "emoji": "🎻",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "StreamBeats",
      "desc": "Musiques d'ambiance gratuites pour streamers et créateurs, par Harris Heller.",
      "url": "https://streambeats.com/",
      "cats": [
        "musiques"
      ],
      "emoji": "📡",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Bensound",
      "desc": "Sélection de pistes musicales gratuites pour projets multimédias sous licence libre.",
      "url": "https://www.bensound.com/free-music-for-videos",
      "cats": [
        "musiques"
      ],
      "emoji": "🎧",
      "status": "freemium"
    },
    {
      "name": "Purple Planet",
      "desc": "Musiques libres de droits pour vidéos et podcasts, couvrant de nombreux genres.",
      "url": "https://www.purple-planet.com/",
      "cats": [
        "musiques"
      ],
      "emoji": "🪐",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Imuno SourceAudio",
      "desc": "Plateforme SourceAudio proposant une sélection de musiques gratuites pour créateurs.",
      "url": "https://imuno.sourceaudio.com/home",
      "cats": [
        "musiques"
      ],
      "emoji": "🔊",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Freepik Tunes",
      "desc": "Moteur de recherche de musiques et effets sonores gratuits pour projets créatifs.",
      "url": "https://tunes.freepik.com/",
      "cats": [
        "musiques",
        "sons"
      ],
      "emoji": "🎵",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Film Music IO",
      "desc": "Catalogue de musiques Creative Commons pour vidéos YouTube et projets audiovisuels.",
      "url": "https://filmmusic.io/en",
      "cats": [
        "musiques"
      ],
      "emoji": "🎬",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "JCAZ Music",
      "desc": "Section de téléchargements gratuits de pistes musicales originales pour créateurs.",
      "url": "https://jcazmusic.com/free-stuff",
      "cats": [
        "musiques"
      ],
      "emoji": "🎸",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Free Stock Music",
      "desc": "Bibliothèque de musiques gratuites à utiliser dans vos vidéos et podcasts.",
      "url": "https://www.free-stock-music.com/",
      "cats": [
        "musiques"
      ],
      "emoji": "🗂️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Silverman Sound",
      "desc": "Sélection de compositions originales offertes gratuitement pour projets créatifs.",
      "url": "https://www.silvermansound.com/free-music",
      "cats": [
        "musiques"
      ],
      "emoji": "🥈",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Moby Gratis",
      "desc": "Collection de musiques de Moby offertes gratuitement pour projets à but non commercial.",
      "url": "https://mobygratis.com/",
      "cats": [
        "musiques"
      ],
      "emoji": "🐋",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Mockup World",
      "desc": "La plus grande collection de mockups Photoshop gratuits au monde, tous styles confondus.",
      "url": "https://www.mockupworld.co",
      "cats": [
        "mockups"
      ],
      "emoji": "🌍",
      "status": "freemium"
    },
    {
      "name": "GraphicBurger",
      "desc": "Ressources design premium gratuites — mockups, templates, textures et UI kits.",
      "url": "https://graphicburger.com",
      "cats": [
        "mockups",
        "textures"
      ],
      "emoji": "🍔",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Shots.so",
      "desc": "Créez de magnifiques présentations de vos designs en quelques clics, sans Photoshop.",
      "url": "https://shots.so",
      "cats": [
        "mockups"
      ],
      "emoji": "📱",
      "status": "freemium"
    },
    {
      "name": "Media Modifier",
      "desc": "Mockups de devices professionnels pour présenter vos créations de façon convaincante.",
      "url": "https://mediamodifier.com",
      "cats": [
        "mockups"
      ],
      "emoji": "🖥️",
      "status": "freemium"
    },
    {
      "name": "Toools.design Mockups",
      "desc": "Sélection de mockups, UI kits et freebies design pour maquettes et présentations.",
      "url": "https://www.toools.design/mockups-ui-kits-and-freebies",
      "cats": [
        "mockups"
      ],
      "emoji": "🗂️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Resourceboy Mockups",
      "desc": "Collection organisée de mockups gratuits (appareils, print, packaging) téléchargeables.",
      "url": "https://resourceboy.com/mockups/",
      "cats": [
        "mockups"
      ],
      "emoji": "📦",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Mr Mockup",
      "desc": "Galerie de mockups gratuits haute résolution pour branding, packaging et plus.",
      "url": "https://mrmockup.com/free-mockups/",
      "cats": [
        "mockups"
      ],
      "emoji": "🎁",
      "status": "freemium"
    },
    {
      "name": "Mockuphone",
      "desc": "Mockups de smartphones, tablettes et montres à personnaliser en ligne et télécharger.",
      "url": "https://mockuphone.com/",
      "cats": [
        "mockups"
      ],
      "emoji": "📱",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Screely",
      "desc": "Transformez vos captures d'écran en présentations élégantes et mockups stylisés en ligne.",
      "url": "https://screely.com",
      "cats": [
        "mockups"
      ],
      "emoji": "🖼️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Material Maker",
      "desc": "Éditeur de matériaux procédural et générateur de textures basé sur des nœuds, inspiré de Godot.",
      "url": "https://www.materialmaker.org/",
      "cats": [
        "jeux",
        "textures",
        "opensource"
      ],
      "emoji": "🧱",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Godot Shaders",
      "desc": "Bibliothèque en ligne de shaders prêts à l'emploi pour le moteur de jeu Godot.",
      "url": "https://godotshaders.com/",
      "cats": [
        "jeux"
      ],
      "emoji": "✨",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Shadertoy",
      "desc": "Plateforme communautaire pour coder et partager des shaders GLSL interactifs en temps réel.",
      "url": "https://www.shadertoy.com/",
      "cats": [
        "jeux",
        "web"
      ],
      "emoji": "🔮",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Tilesetter",
      "desc": "Outil d'automatisation pour créer et organiser des tilesets pixel art facilement.",
      "url": "https://www.tilesetter.org/",
      "cats": [
        "jeux"
      ],
      "emoji": "🗺️",
      "status": "freemium"
    },
    {
      "name": "Tilemancer",
      "desc": "Générateur de tilesets procédural pour jeux en pixel art, disponible sur itch.io.",
      "url": "https://led.itch.io/tilemancer",
      "cats": [
        "jeux"
      ],
      "emoji": "🧩",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "LPC Spritesheet Generator",
      "desc": "Générateur de personnages au format LPC avec personnalisation complète des sprites.",
      "url": "https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/",
      "cats": [
        "jeux",
        "opensource"
      ],
      "emoji": "🧍",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "LibreSprite",
      "desc": "Éditeur de pixel art et d'animations open-source, fork gratuit d'Aseprite.",
      "url": "https://libresprite.github.io/",
      "cats": [
        "jeux",
        "outils",
        "opensource"
      ],
      "emoji": "🖼️",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Piskel",
      "desc": "Éditeur gratuit de pixel art en ligne, avec export de spritesheets animées.",
      "url": "https://www.piskelapp.com/",
      "cats": [
        "jeux",
        "outils",
        "opensource"
      ],
      "emoji": "🎨",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "DragonBones",
      "desc": "Suite d'outils pour créer des animations 2D squelettiques, alternative gratuite à Spine.",
      "url": "https://dragonbones.github.io/en/download.html",
      "cats": [
        "jeux",
        "opensource"
      ],
      "emoji": "🦴",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "MagicaVoxel",
      "desc": "Éditeur de voxel 3D léger et gratuit avec rendu en temps réel.",
      "url": "https://ephtracy.github.io/",
      "cats": [
        "jeux",
        "outils"
      ],
      "emoji": "🧊",
      "status": "free"
    },
    {
      "name": "Blockbench",
      "desc": "Créateur de modèles 3D low-poly et pixel-art pour Minecraft et jeux similaires.",
      "url": "https://www.blockbench.net/",
      "cats": [
        "jeux",
        "outils",
        "opensource"
      ],
      "emoji": "🟦",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Tiled",
      "desc": "Éditeur de cartes par tuiles polyvalent pour le développement de jeux 2D.",
      "url": "https://www.mapeditor.org/",
      "cats": [
        "jeux",
        "outils",
        "opensource"
      ],
      "emoji": "🗾",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "LDtk",
      "desc": "Level Designer Toolkit : éditeur de niveaux moderne basé sur une grille, gratuit et open-source.",
      "url": "https://ldtk.io/",
      "cats": [
        "jeux",
        "outils"
      ],
      "emoji": "📐",
      "status": "freemium",
      "noaccount": true
    },
    {
      "name": "TrenchBroom",
      "desc": "Éditeur de maps 3D pour jeux basés sur le moteur Quake, intuitif et puissant.",
      "url": "https://trenchbroom.github.io/",
      "cats": [
        "jeux",
        "opensource"
      ],
      "emoji": "🏗️",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "OpenGameArt",
      "desc": "Plateforme communautaire de ressources graphiques, sonores et code open-source pour jeux.",
      "url": "https://opengameart.org/",
      "cats": [
        "jeux",
        "images",
        "sons"
      ],
      "emoji": "🎭",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Quaternius",
      "desc": "Modèles 3D et pixel art sous licence libre, gratuits pour tous types de projets.",
      "url": "https://quaternius.com/",
      "cats": [
        "jeux"
      ],
      "emoji": "🐉",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Poly Haven",
      "desc": "Bibliothèque de HDRI, modèles 3D PBR et textures entièrement libres de droits.",
      "url": "https://polyhaven.com/",
      "cats": [
        "jeux",
        "textures",
        "images"
      ],
      "emoji": "🌐",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "ambientCG",
      "desc": "Collection de textures PBR et matériaux CC0 pour shader et rendu 3D.",
      "url": "https://ambientcg.com/",
      "cats": [
        "jeux",
        "textures"
      ],
      "emoji": "🪨",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Game UI Database",
      "desc": "Base de données collaborative d'interfaces de jeux vidéo pour s'inspirer et télécharger des assets UI.",
      "url": "https://www.gameuidatabase.com/",
      "cats": [
        "jeux",
        "inspi"
      ],
      "emoji": "🖥️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "The Spriters Resource",
      "desc": "Archives de sprites rippés depuis des centaines de jeux vidéo, classés par console et titre.",
      "url": "https://www.spriters-resource.com/",
      "cats": [
        "jeux"
      ],
      "emoji": "👾",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Sketchfab",
      "desc": "Marketplace de modèles 3D dont une large sélection gratuite, visualisables dans le navigateur.",
      "url": "https://sketchfab.com/",
      "cats": [
        "jeux"
      ],
      "emoji": "🗿",
      "status": "freemium"
    },
    {
      "name": "Kenney",
      "desc": "Milliers d'assets de jeux gratuits (sprites, sons, modèles 3D, UI) sous licence CC0.",
      "url": "https://kenney.nl/",
      "cats": [
        "jeux",
        "sons",
        "images"
      ],
      "emoji": "🏆",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "itch.io — Free Assets",
      "desc": "Section assets gratuits d'itch.io : sprites, tilesets, sons et polices pour jeux.",
      "url": "https://itch.io/game-assets/free",
      "cats": [
        "jeux"
      ],
      "emoji": "🎮",
      "status": "free"
    },
    {
      "name": "Coverr",
      "desc": "Vidéos de stock gratuites en haute résolution pour sites web et présentations.",
      "url": "https://coverr.co/",
      "cats": [
        "video"
      ],
      "emoji": "🎥",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Mazwai",
      "desc": "Clips vidéo gratuits de qualité cinématographique par des vidéastes indépendants.",
      "url": "https://mazwai.com/",
      "cats": [
        "video"
      ],
      "emoji": "🎞️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Indieground Freebies",
      "desc": "Sélection de freebies graphiques — illustrations, textures et polices disponibles gratuitement.",
      "url": "https://indieground.net/shop-category/freebies/",
      "cats": [
        "textures",
        "illustrations",
        "polices"
      ],
      "emoji": "🎨",
      "status": "freemium"
    },
    {
      "name": "StudioAAA Free",
      "desc": "Ressources gratuites — modèles 3D, textures et icônes à télécharger sans frais.",
      "url": "https://studioaaa.com/product-category/free/",
      "cats": [
        "textures",
        "jeux"
      ],
      "emoji": "🏛️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "BLK Market Free",
      "desc": "Section gratuite de BLK Market — polices, icônes et textures librement téléchargeables.",
      "url": "https://blkmarket.com/product-category/free/",
      "cats": [
        "textures",
        "polices",
        "icones"
      ],
      "emoji": "🖤",
      "status": "free"
    },
    {
      "name": "Doron Supply Freebies",
      "desc": "Ressources graphiques gratuites filtrées — textures, overlays et assets pour créatifs.",
      "url": "https://www.doronsupply.com/shop/filter-freebies",
      "cats": [
        "textures",
        "illustrations"
      ],
      "emoji": "🌿",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Resourceboy Textures",
      "desc": "Collection de textures gratuites pour design graphique et 3D, classées par thème.",
      "url": "https://resourceboy.com/textures/",
      "cats": [
        "textures"
      ],
      "emoji": "🪨",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "TextureFabrik",
      "desc": "Galerie de textures haute résolution gratuites pour tous types de projets créatifs.",
      "url": "https://texturefabrik.com/gallery/",
      "cats": [
        "textures"
      ],
      "emoji": "🧱",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Resourceboy Brushes",
      "desc": "Collection de brosses gratuites et premium pour Photoshop, classées par style et usage.",
      "url": "https://resourceboy.com/photoshop-brushes/",
      "cats": [
        "brushes"
      ],
      "emoji": "🖌️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Brusheezy",
      "desc": "Des milliers de brosses Photoshop et ressources graphiques gratuites à télécharger.",
      "url": "https://www.brusheezy.com/",
      "cats": [
        "brushes"
      ],
      "emoji": "🎨",
      "status": "free"
    },
    {
      "name": "PNGWing",
      "desc": "Bibliothèque de fichiers PNG à fond transparent gratuits, classés par thème.",
      "url": "https://www.pngwing.com",
      "cats": [
        "png"
      ],
      "emoji": "🖼️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "ImgBin",
      "desc": "Collection de PNGs HD à fond transparent pour tous types de projets créatifs.",
      "url": "https://imgbin.com/",
      "cats": [
        "png"
      ],
      "emoji": "🔳",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "StickPNG",
      "desc": "Milliers de PNG transparents sans fond, organisés par catégorie et téléchargeables gratuitement.",
      "url": "https://www.stickpng.com/",
      "cats": [
        "png"
      ],
      "emoji": "🖼️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Lummi",
      "desc": "Générateur d'images par IA avec une large variété de styles visuels.",
      "url": "https://www.lummi.ai/",
      "cats": [
        "ia"
      ],
      "emoji": "✨",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "ArtBot",
      "desc": "Outil IA pour créer des illustrations originales à partir de descriptions textuelles.",
      "url": "https://tinybots.net/artbot/create",
      "cats": [
        "ia",
        "opensource"
      ],
      "emoji": "🤖",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Leonardo.ai",
      "desc": "Générateur d'images IA de haute qualité, idéal pour le concept art et les assets de jeux.",
      "url": "https://leonardo.ai/",
      "cats": [
        "ia"
      ],
      "emoji": "🦁",
      "status": "freemium"
    },
    {
      "name": "Ideogram",
      "desc": "Générateur d'images IA avec une gestion remarquable du texte dans les visuels.",
      "url": "https://ideogram.ai/",
      "cats": [
        "ia"
      ],
      "emoji": "💬",
      "status": "freemium"
    },
    {
      "name": "Adobe Firefly",
      "desc": "Outils de génération d'images et d'effets IA par Adobe, intégrés à Creative Cloud.",
      "url": "https://firefly.adobe.com/",
      "cats": [
        "ia",
        "design"
      ],
      "emoji": "🔥",
      "status": "freemium"
    },
    {
      "name": "Krea.ai",
      "desc": "Générateur d'images IA en temps réel avec contrôle avancé du style et de la composition.",
      "url": "https://www.krea.ai/",
      "cats": [
        "ia"
      ],
      "emoji": "🎨",
      "status": "freemium"
    },
    {
      "name": "Playground AI",
      "desc": "Plateforme de génération d'images IA gratuite avec de nombreux modèles disponibles.",
      "url": "https://playground.com/",
      "cats": [
        "ia"
      ],
      "emoji": "🛝",
      "status": "freemium"
    },
    {
      "name": "Space Type Generator",
      "desc": "Générateur en ligne de compositions typographiques spatiales et cinétiques.",
      "url": "https://spacetypegenerator.com/",
      "cats": [
        "outils",
        "polices"
      ],
      "emoji": "🌌",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Inclusive Colors",
      "desc": "Simulateur de vision des couleurs pour vérifier l'accessibilité de vos palettes.",
      "url": "https://www.inclusivecolors.com/",
      "cats": [
        "outils",
        "couleurs"
      ],
      "emoji": "♿",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Vectorpea",
      "desc": "Éditeur de graphiques vectoriels en ligne gratuit, alternative à Illustrator.",
      "url": "https://www.vectorpea.com/",
      "cats": [
        "outils",
        "design"
      ],
      "emoji": "✒️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Wordmark.it",
      "desc": "Visualisez rapidement votre texte dans toutes les polices installées sur votre système.",
      "url": "https://wordmark.it/",
      "cats": [
        "outils",
        "polices"
      ],
      "emoji": "🔤",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "WhatTheFont",
      "desc": "Service d'identification de polices à partir d'une image, par MyFonts.",
      "url": "https://www.myfonts.com/fr/pages/whatthefont",
      "cats": [
        "outils",
        "polices"
      ],
      "emoji": "🔍",
      "status": "free"
    },
    {
      "name": "Metatags.io",
      "desc": "Générateur et éditeur de balises meta pour optimiser le partage sur les réseaux sociaux.",
      "url": "https://metatags.io/",
      "cats": [
        "outils",
        "web"
      ],
      "emoji": "🏷️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "FontBrief",
      "desc": "Plateforme pour organiser, tester et partager des projets de typographie en équipe.",
      "url": "https://www.fontbrief.com/",
      "cats": [
        "outils",
        "polices"
      ],
      "emoji": "📋",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Tooooools",
      "desc": "Suite d'outils créatifs en ligne pour designers — couleurs, typographie, icônes et plus.",
      "url": "https://www.tooooools.app/",
      "cats": [
        "outils"
      ],
      "emoji": "🧰",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Type Tools",
      "desc": "Collection d'utilitaires en ligne pour la gestion et l'inspection de polices.",
      "url": "https://www.type-tools.com/",
      "cats": [
        "outils",
        "polices"
      ],
      "emoji": "🔧",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "CSS Gradient",
      "desc": "Générateur de dégradés CSS visuel avec prévisualisation en temps réel et copie du code.",
      "url": "https://cssgradient.io/",
      "cats": [
        "web",
        "couleurs"
      ],
      "emoji": "🌈",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Haikei",
      "desc": "Générateur de fonds SVG organiques — vagues, blobs, grilles et formes personnalisables.",
      "url": "https://haikei.app/",
      "cats": [
        "web"
      ],
      "emoji": "🌊",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Animista",
      "desc": "Bibliothèque d'animations CSS prêtes à l'emploi, prévisualisables et personnalisables.",
      "url": "https://animista.net/",
      "cats": [
        "web"
      ],
      "emoji": "💫",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Hero Patterns",
      "desc": "Collection de motifs SVG répétables et personnalisables pour fonds de pages web.",
      "url": "https://heropatterns.com/",
      "cats": [
        "web",
        "textures"
      ],
      "emoji": "✦",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Neumorphism.io",
      "desc": "Générateur de styles CSS neumorphiques pour créer des interfaces douces et modernes.",
      "url": "https://neumorphism.io/",
      "cats": [
        "web"
      ],
      "emoji": "⬜",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "CSS Loaders",
      "desc": "Collection de loaders et spinners CSS purs, copiables en un clic pour vos projets.",
      "url": "https://css-loaders.com/",
      "cats": [
        "web"
      ],
      "emoji": "⏳",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Patternpad",
      "desc": "Créez des motifs géométriques infinis personnalisables, exportables en SVG ou PNG.",
      "url": "https://patternpad.com/",
      "cats": [
        "web",
        "textures"
      ],
      "emoji": "🔲",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Can I Use",
      "desc": "Référence de compatibilité des fonctionnalités HTML, CSS et JS selon les navigateurs.",
      "url": "https://caniuse.com/",
      "cats": [
        "web",
        "opensource"
      ],
      "emoji": "✅",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Saint11 — Pixel Art Tutorials",
      "desc": "Tutoriels pas-à-pas pour apprendre et perfectionner vos techniques de pixel art.",
      "url": "https://saint11.art/blog/pixel-art-tutorials/",
      "cats": [
        "tutos",
        "jeux"
      ],
      "emoji": "🎓",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "The Futur",
      "desc": "Ressources éducatives gratuites sur le design, le branding et la direction artistique.",
      "url": "https://www.thefutur.com/free-resources",
      "cats": [
        "tutos",
        "inspi"
      ],
      "emoji": "🔭",
      "status": "freemium"
    },
    {
      "name": "Sharpen Design",
      "desc": "Générateur de challenges de design pour pratiquer et améliorer vos compétences.",
      "url": "https://sharpen.design/",
      "cats": [
        "tutos"
      ],
      "emoji": "⚔️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Cosmos",
      "desc": "Galerie d'inspiration pour interfaces web, avec sélection de sites et composants UI modernes.",
      "url": "https://www.cosmos.so/discover",
      "cats": [
        "inspi"
      ],
      "emoji": "🌌",
      "status": "freemium"
    },
    {
      "name": "Same Energy",
      "desc": "Moteur de recherche visuel par similarité d'ambiance pour trouver des images inspirantes.",
      "url": "https://same.energy/",
      "cats": [
        "inspi"
      ],
      "emoji": "✨",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Abduzeedo",
      "desc": "Blog de design graphique et digital proposant tutoriels, articles et sources d'inspiration.",
      "url": "https://abduzeedo.com/",
      "cats": [
        "inspi",
        "tutos"
      ],
      "emoji": "📰",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Lapa Ninja",
      "desc": "Collection organisée de landing pages créatives pour puiser des idées de mise en page.",
      "url": "https://www.lapa.ninja/",
      "cats": [
        "inspi"
      ],
      "emoji": "🥷",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Savee",
      "desc": "Plateforme de bookmarking visuel pour enregistrer et partager des références graphiques.",
      "url": "https://savee.it/",
      "cats": [
        "inspi"
      ],
      "emoji": "📌",
      "status": "free"
    },
    {
      "name": "ArtStation",
      "desc": "Réseau social professionnel où les artistes 2D/3D exposent leurs portfolios et projets.",
      "url": "https://www.artstation.com/",
      "cats": [
        "inspi"
      ],
      "emoji": "🎨",
      "status": "free"
    },
    {
      "name": "Identity Designed",
      "desc": "Cas d'étude sur le branding et l'identité visuelle de marques prestigieuses du monde entier.",
      "url": "https://identitydesigned.com/",
      "cats": [
        "inspi"
      ],
      "emoji": "🏷️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Behance",
      "desc": "Plateforme Adobe pour découvrir et partager des projets créatifs dans tous les domaines du design.",
      "url": "https://www.behance.net/",
      "cats": [
        "inspi"
      ],
      "emoji": "🅱️",
      "status": "freemium"
    },
    {
      "name": "Dribbble",
      "desc": "Communauté de designers partageant leurs créations UI, branding et illustration.",
      "url": "https://dribbble.com/",
      "cats": [
        "inspi"
      ],
      "emoji": "🏀",
      "status": "freemium"
    },
    {
      "name": "Awwwards",
      "desc": "Prix et galerie des meilleurs sites web mondiaux en design, créativité et innovation.",
      "url": "https://www.awwwards.com/",
      "cats": [
        "inspi"
      ],
      "emoji": "🏆",
      "status": "freemium"
    },
    {
      "name": "Mobbin",
      "desc": "Bibliothèque de patterns et flows UI/UX réels issus des meilleures apps mobiles et web.",
      "url": "https://mobbin.com/",
      "cats": [
        "inspi"
      ],
      "emoji": "📱",
      "status": "freemium"
    },
    {
      "name": "Godly",
      "desc": "Sélection des sites web les plus créatifs et innovants du moment.",
      "url": "https://godly.website/",
      "cats": [
        "inspi"
      ],
      "emoji": "⚡",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Land-book",
      "desc": "Galerie de landing pages inspirantes pour designers et marketeurs.",
      "url": "https://land-book.com/",
      "cats": [
        "inspi"
      ],
      "emoji": "📖",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Collect UI",
      "desc": "Collection quotidienne de composants UI inspirants tirés de Dribbble.",
      "url": "https://collectui.com/",
      "cats": [
        "inspi"
      ],
      "emoji": "🗂️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "SiteInspire",
      "desc": "Galerie de sites web soigneusement sélectionnés pour leur design remarquable.",
      "url": "https://www.siteinspire.com/",
      "cats": [
        "inspi"
      ],
      "emoji": "✦",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Kaboompics",
      "desc": "Photos lifestyle gratuites de haute qualité avec palettes de couleurs associées à chaque photo.",
      "url": "https://kaboompics.com",
      "cats": [
        "images"
      ],
      "emoji": "💥",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Gratisography",
      "desc": "Photos absurdes, décalées et créatives libres de droits par le photographe Ryan McGuire.",
      "url": "https://gratisography.com",
      "cats": [
        "images"
      ],
      "emoji": "🎭",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Picjumbo",
      "desc": "Photos gratuites de haute qualité couvrant lifestyle, tech, nature et affaires.",
      "url": "https://picjumbo.com",
      "cats": [
        "images"
      ],
      "emoji": "🦘",
      "status": "freemium"
    },
    {
      "name": "New Old Stock",
      "desc": "Photos vintage issues d'archives publiques, libres de droits sans restriction d'usage.",
      "url": "https://nos.twnsnd.co",
      "cats": [
        "images"
      ],
      "emoji": "🕰️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Foodiesfeed",
      "desc": "Photos culinaires professionnelles gratuites pour projets food, blog et réseaux sociaux.",
      "url": "https://www.foodiesfeed.com",
      "cats": [
        "images"
      ],
      "emoji": "🍕",
      "status": "freemium"
    },
    {
      "name": "SplitShire",
      "desc": "Photos et vidéos libres de droits créées par un photographe professionnel.",
      "url": "https://www.splitshire.com",
      "cats": [
        "images",
        "video"
      ],
      "emoji": "🌅",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Negative Space",
      "desc": "Photos CC0 orientées minimalisme, espace négatif et compositions épurées.",
      "url": "https://negativespace.co",
      "cats": [
        "images"
      ],
      "emoji": "⬛",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Pikwizard",
      "desc": "Moteur de recherche de photos et vidéos gratuites avec millions d'images libres de droits.",
      "url": "https://pikwizard.com",
      "cats": [
        "images"
      ],
      "emoji": "🔍",
      "status": "freemium"
    },
    {
      "name": "Stockvault",
      "desc": "Archive de photos, illustrations et textures gratuites pour usage personnel et commercial.",
      "url": "https://www.stockvault.net",
      "cats": [
        "images",
        "textures"
      ],
      "emoji": "🗄️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Jay Mantri",
      "desc": "Photos minimalistes et poétiques libres de droits sous licence CC0.",
      "url": "https://jaymantri.com",
      "cats": [
        "images"
      ],
      "emoji": "🌿",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Morguefile",
      "desc": "Archives de photos gratuites pour usage commercial sans attribution requise.",
      "url": "https://morguefile.com",
      "cats": [
        "images"
      ],
      "emoji": "🗂️",
      "status": "free"
    },
    {
      "name": "Skitterphoto",
      "desc": "Photos libres CC0 — portraits, nature, architecture, lifestyle et scènes urbaines.",
      "url": "https://skitterphoto.com",
      "cats": [
        "images"
      ],
      "emoji": "📸",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Iwaria",
      "desc": "Banque de photos africaines libres de droits représentant la culture et les personnes d'Afrique.",
      "url": "https://iwaria.com",
      "cats": [
        "images"
      ],
      "emoji": "🌍",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "WOCinTech Chat",
      "desc": "Photos de femmes de couleur dans des contextes tech, disponibles sous CC-BY.",
      "url": "https://www.wocintechchat.com",
      "cats": [
        "images"
      ],
      "emoji": "💻",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Disabled And Here",
      "desc": "Photos libres de droits représentant des personnes handicapées actives dans leur quotidien.",
      "url": "https://affecttheverb.com/disabledandhere",
      "cats": [
        "images"
      ],
      "emoji": "♿",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "This Person Does Not Exist",
      "desc": "Portraits humains ultra-réalistes générés par IA — entièrement fictifs et libres d'usage.",
      "url": "https://this-person-does-not-exist.com",
      "cats": [
        "images",
        "ia"
      ],
      "emoji": "🤖",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Use & Modify",
      "desc": "Sélection de polices librement utilisables et modifiables sous licences ouvertes, très curatée.",
      "url": "https://usemodify.com",
      "cats": [
        "polices"
      ],
      "emoji": "✏️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Indestructible Type",
      "desc": "Fonderie indépendante offrant des polices de qualité haut de gamme sous licence libre.",
      "url": "https://indestructibletype.com",
      "cats": [
        "polices"
      ],
      "emoji": "💪",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "The League of Moveable Type",
      "desc": "Première fonderie open-source, pionnière des polices libres de qualité éditoriale.",
      "url": "https://www.theleagueofmoveabletype.com",
      "cats": [
        "polices",
        "opensource"
      ],
      "emoji": "🏆",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Uncut.wtf",
      "desc": "Collection de polices d'affichage expressives et gratuites pour projets créatifs audacieux.",
      "url": "https://uncut.wtf",
      "cats": [
        "polices"
      ],
      "emoji": "✂️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Collletttivo",
      "desc": "Bibliothèque expérimentale de polices variables et display libres de droits, très originales.",
      "url": "https://collletttivo.it",
      "cats": [
        "polices",
        "opensource"
      ],
      "emoji": "🔬",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Tunera Type Foundry",
      "desc": "Fonderie indépendante proposant des familles typographiques soignées sous Open Font License.",
      "url": "https://www.tunera.xyz",
      "cats": [
        "polices"
      ],
      "emoji": "🌿",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Feather Icons",
      "desc": "Collection d'icônes SVG légères, lisibles et élégantes — entièrement open-source.",
      "url": "https://feathericons.com",
      "cats": [
        "icones",
        "opensource"
      ],
      "emoji": "🪶",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Remix Icon",
      "desc": "Bibliothèque de plus de 2800 icônes vectorielles open-source en style outline et filled.",
      "url": "https://remixicon.com",
      "cats": [
        "icones",
        "opensource"
      ],
      "emoji": "♾️",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Iconoir",
      "desc": "Plus de 1600 icônes SVG open-source avec un style épuré, cohérent et minimaliste.",
      "url": "https://iconoir.com",
      "cats": [
        "icones",
        "opensource"
      ],
      "emoji": "🔑",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Bootstrap Icons",
      "desc": "Bibliothèque officielle Bootstrap de plus de 2000 icônes SVG libres et personnalisables.",
      "url": "https://icons.getbootstrap.com",
      "cats": [
        "icones",
        "opensource"
      ],
      "emoji": "🅱️",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Material Symbols",
      "desc": "Icônes Google Material Design avec variables CSS pour contrôler poids, taille et style.",
      "url": "https://fonts.google.com/icons",
      "cats": [
        "icones",
        "opensource"
      ],
      "emoji": "Ⓜ️",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Octicons",
      "desc": "Icônes SVG open-source créées par GitHub, idéales pour interfaces dev et plateformes web.",
      "url": "https://primer.style/foundations/icons",
      "cats": [
        "icones",
        "opensource"
      ],
      "emoji": "🐙",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Eva Icons",
      "desc": "Pack de plus de 480 icônes beautifully crafted open-source pour web et mobile.",
      "url": "https://akveo.github.io/eva-icons/",
      "cats": [
        "icones",
        "opensource"
      ],
      "emoji": "💎",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "OpenMoji",
      "desc": "Emojis open-source entièrement éditables en SVG et PNG — projet communautaire et libre.",
      "url": "https://openmoji.org",
      "cats": [
        "icones",
        "opensource"
      ],
      "emoji": "😊",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Fluent Emoji",
      "desc": "Emojis Microsoft open-source en 3D et flat, disponibles sur GitHub sous MIT.",
      "url": "https://github.com/microsoft/fluentui-emoji",
      "cats": [
        "icones",
        "opensource"
      ],
      "emoji": "✨",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Twemoji",
      "desc": "Emojis Twitter open-source compatibles multiplateformes, licence CC-BY 4.0.",
      "url": "https://github.com/jdecked/twemoji",
      "cats": [
        "icones",
        "opensource"
      ],
      "emoji": "🐦",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "IRA Design",
      "desc": "Illustrations à composants modulaires avec dégradés colorés, personnalisables par style.",
      "url": "https://iradesign.io",
      "cats": [
        "illustrations"
      ],
      "emoji": "🎨",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "ManyPixels",
      "desc": "Bibliothèque d'illustrations vectorielles gratuites déclinées dans divers styles modernes.",
      "url": "https://www.manypixels.co/gallery",
      "cats": [
        "illustrations"
      ],
      "emoji": "🖼️",
      "status": "freemium"
    },
    {
      "name": "Illlustrations.co",
      "desc": "Illustrations SVG gratuites déclinées en 7 styles distincts pour tous types de projets.",
      "url": "https://illlustrations.co",
      "cats": [
        "illustrations"
      ],
      "emoji": "🎭",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Delesign",
      "desc": "Bibliothèque d'illustrations et d'icônes gratuites pour usage personnel et commercial.",
      "url": "https://delesign.com/free-designs/graphics/",
      "cats": [
        "illustrations",
        "icones"
      ],
      "emoji": "🎯",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Pixeltrue",
      "desc": "Illustrations vectorielles animées gratuites pour projets web, apps et présentations.",
      "url": "https://www.pixeltrue.com/free-illustrations",
      "cats": [
        "illustrations"
      ],
      "emoji": "👾",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Black Illustrations",
      "desc": "Pack d'illustrations représentant des personnages noirs pour un design inclusif et diversifié.",
      "url": "https://www.blackillustrations.com",
      "cats": [
        "illustrations"
      ],
      "emoji": "✊",
      "status": "freemium"
    },
    {
      "name": "Fresh Folk",
      "desc": "Bibliothèque d'illustrations de personnages diversifiés en style plat, librement utilisables.",
      "url": "https://fresh-folk.com",
      "cats": [
        "illustrations"
      ],
      "emoji": "🌻",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Stubborn",
      "desc": "Générateur de personnages illustrés avec combinaisons de poses, expressions et styles.",
      "url": "https://stubborn.fun",
      "cats": [
        "illustrations"
      ],
      "emoji": "😤",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Vecteezy",
      "desc": "Plateforme de vecteurs, SVG et illustrations gratuits — millions de ressources disponibles.",
      "url": "https://www.vecteezy.com",
      "cats": [
        "illustrations",
        "icones",
        "images"
      ],
      "emoji": "🎨",
      "status": "freemium"
    },
    {
      "name": "Khroma",
      "desc": "Générateur de palettes personnalisé par IA basé sur vos préférences de couleurs apprises.",
      "url": "https://www.khroma.co",
      "cats": [
        "couleurs"
      ],
      "emoji": "🤖",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Huemint",
      "desc": "Générateur de palettes IA conçu pour les identités de marque et les interfaces digitales.",
      "url": "https://huemint.com",
      "cats": [
        "couleurs"
      ],
      "emoji": "🧠",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Colormind",
      "desc": "Générateur de palettes IA qui apprend les styles des films, œuvres d'art et designs.",
      "url": "http://colormind.io",
      "cats": [
        "couleurs"
      ],
      "emoji": "🎨",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "ColorSpace",
      "desc": "Générez des palettes harmonieuses depuis une ou deux couleurs de base, avec prévisualisation.",
      "url": "https://mycolor.space",
      "cats": [
        "couleurs"
      ],
      "emoji": "🌈",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Happy Hues",
      "desc": "Palettes contextualisées directement sur un vrai design pour voir le rendu en situation réelle.",
      "url": "https://www.happyhues.co",
      "cats": [
        "couleurs"
      ],
      "emoji": "😊",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Untitled UI",
      "desc": "Kit Figma complet et professionnel — le UI kit gratuit le plus populaire de Figma Community.",
      "url": "https://www.untitledui.com",
      "cats": [
        "design"
      ],
      "emoji": "⬜",
      "status": "freemium"
    },
    {
      "name": "shadcn/ui",
      "desc": "Composants React réutilisables, accessibles et personnalisables avec Tailwind CSS.",
      "url": "https://ui.shadcn.com",
      "cats": [
        "design",
        "web",
        "opensource"
      ],
      "emoji": "🧩",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Aceternity UI",
      "desc": "Composants UI animés et modernes pour React avec Tailwind CSS et Framer Motion.",
      "url": "https://ui.aceternity.com",
      "cats": [
        "design",
        "web"
      ],
      "emoji": "🌀",
      "status": "freemium"
    },
    {
      "name": "Spline",
      "desc": "Outil de design 3D en ligne pour créer des scènes interactives directement dans le navigateur.",
      "url": "https://spline.design",
      "cats": [
        "design",
        "web",
        "3d"
      ],
      "emoji": "🌐",
      "status": "freemium"
    },
    {
      "name": "Polotno Studio",
      "desc": "Éditeur graphique web open-source sans inscription ni limite — alternative à Canva.",
      "url": "https://studio.polotno.com",
      "cats": [
        "design"
      ],
      "emoji": "🎨",
      "status": "freemium",
      "noaccount": true
    },
    {
      "name": "Pixlr",
      "desc": "Éditeur photo en ligne complet avec outils IA intégrés, alternative légère à Photoshop.",
      "url": "https://pixlr.com",
      "cats": [
        "design",
        "outils"
      ],
      "emoji": "🖊️",
      "status": "freemium"
    },
    {
      "name": "Kapwing",
      "desc": "Studio créatif en ligne pour éditer vidéos, images et sous-titres avec des outils IA.",
      "url": "https://www.kapwing.com",
      "cats": [
        "design",
        "video"
      ],
      "emoji": "🎬",
      "status": "freemium"
    },
    {
      "name": "Audacity",
      "desc": "Éditeur audio multi-piste open-source, gratuit sur toutes plateformes — référence de l'audio.",
      "url": "https://www.audacityteam.org",
      "cats": [
        "design",
        "sons",
        "opensource"
      ],
      "emoji": "🎤",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Transparent Textures",
      "desc": "Motifs transparents CSS/PNG personnalisables en couleur et opacité pour fonds web.",
      "url": "https://www.transparenttextures.com",
      "cats": [
        "textures",
        "web",
        "opensource"
      ],
      "emoji": "🔳",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Subtle Patterns",
      "desc": "Bibliothèque de motifs de fond subtils et discrets, parfaits pour interfaces minimalistes.",
      "url": "https://www.toptal.com/designers/subtlepatterns/",
      "cats": [
        "textures",
        "web"
      ],
      "emoji": "🌫️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Lost and Taken",
      "desc": "Textures naturelles et organiques haute résolution libres pour tout usage créatif.",
      "url": "https://lostandtaken.com",
      "cats": [
        "textures"
      ],
      "emoji": "🌿",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "MagicPattern",
      "desc": "Générateur de motifs SVG et CSS géométriques pour fonds et textures web.",
      "url": "https://www.magicpattern.design",
      "cats": [
        "textures",
        "web"
      ],
      "emoji": "✨",
      "status": "freemium"
    },
    {
      "name": "SVG Backgrounds",
      "desc": "Collection de fonds SVG géométriques personnalisables en couleur pour sites web.",
      "url": "https://www.svgbackgrounds.com",
      "cats": [
        "textures",
        "web"
      ],
      "emoji": "🔷",
      "status": "freemium"
    },
    {
      "name": "Texturelabs",
      "desc": "Textures haute résolution gratuites pour photo-manipulation, compositing et design graphique.",
      "url": "https://texturelabs.org",
      "cats": [
        "textures"
      ],
      "emoji": "🧱",
      "status": "freemium"
    },
    {
      "name": "Anthony Boyd Graphics",
      "desc": "Mockups Photoshop haute qualité pour branding et print — section freebies régulièrement mise à jour.",
      "url": "https://www.anthonyboyd.graphics",
      "cats": [
        "mockups"
      ],
      "emoji": "💎",
      "status": "freemium"
    },
    {
      "name": "LS Graphics",
      "desc": "Mockups gratuits et ressources design pour présentations branding professionnelles.",
      "url": "https://www.ls.graphics/free",
      "cats": [
        "mockups"
      ],
      "emoji": "🎁",
      "status": "freemium"
    },
    {
      "name": "Mockup Hunt",
      "desc": "Annuaire de mockups gratuits provenant de diverses sources, actualisé régulièrement.",
      "url": "https://www.mockuphunt.co",
      "cats": [
        "mockups"
      ],
      "emoji": "🔍",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Unblast Mockups",
      "desc": "Mockups de qualité professionnelle gratuits — dispositifs, branding, print et packaging.",
      "url": "https://unblast.com/mockups/",
      "cats": [
        "mockups"
      ],
      "emoji": "💥",
      "status": "freemium"
    },
    {
      "name": "True Grit Texture Supply",
      "desc": "Textures, brushes et overlays grunge/rétro pour Photoshop et Procreate avec freebies.",
      "url": "https://www.truegrit.co",
      "cats": [
        "brushes",
        "textures"
      ],
      "emoji": "🖌️",
      "status": "freemium"
    },
    {
      "name": "CleanPNG",
      "desc": "Moteur de recherche de PNG transparents HD classés par thème et catégorie.",
      "url": "https://www.cleanpng.com",
      "cats": [
        "png"
      ],
      "emoji": "🔍",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "PNGAll",
      "desc": "Collection de PNG transparents couvrant une large variété de sujets et objets.",
      "url": "https://www.pngall.com",
      "cats": [
        "png"
      ],
      "emoji": "🗂️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "PurePNG",
      "desc": "Bibliothèque de PNG transparents haute qualité, gratuits et faciles à rechercher.",
      "url": "https://purepng.com",
      "cats": [
        "png"
      ],
      "emoji": "✨",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Lexica",
      "desc": "Moteur de recherche et générateur d'images IA basé sur Stable Diffusion avec galerie communautaire.",
      "url": "https://lexica.art",
      "cats": [
        "ia"
      ],
      "emoji": "📚",
      "status": "freemium"
    },
    {
      "name": "Craiyon",
      "desc": "Générateur d'images IA gratuit et illimité dans le navigateur, anciennement DALL-E mini.",
      "url": "https://www.craiyon.com",
      "cats": [
        "ia"
      ],
      "emoji": "🖍️",
      "status": "freemium"
    },
    {
      "name": "OpenArt",
      "desc": "Plateforme de génération et exploration d'images IA avec des dizaines de modèles disponibles.",
      "url": "https://openart.ai",
      "cats": [
        "ia"
      ],
      "emoji": "🎨",
      "status": "freemium"
    },
    {
      "name": "NightCafe",
      "desc": "Créateur d'art IA avec plusieurs algorithmes de génération et communauté active.",
      "url": "https://creator.nightcafe.studio",
      "cats": [
        "ia"
      ],
      "emoji": "🌙",
      "status": "freemium"
    },
    {
      "name": "Mage.space",
      "desc": "Générateur Stable Diffusion rapide et gratuit dans le navigateur, sans inscription requise.",
      "url": "https://www.mage.space",
      "cats": [
        "ia"
      ],
      "emoji": "🔮",
      "status": "freemium"
    },
    {
      "name": "Runway",
      "desc": "Suite créative IA leader pour générer, éditer et transformer des vidéos et images.",
      "url": "https://runwayml.com",
      "cats": [
        "ia",
        "video"
      ],
      "emoji": "✈️",
      "status": "freemium"
    },
    {
      "name": "Pika",
      "desc": "Générateur de vidéos IA à partir de texte ou d'images — résultats de haute qualité.",
      "url": "https://pika.art",
      "cats": [
        "ia",
        "video"
      ],
      "emoji": "⚡",
      "status": "freemium"
    },
    {
      "name": "Luma Dream Machine",
      "desc": "Génère des vidéos réalistes et stylisées de haute qualité à partir de texte ou d'image.",
      "url": "https://lumalabs.ai/dream-machine",
      "cats": [
        "ia",
        "video"
      ],
      "emoji": "🌙",
      "status": "freemium"
    },
    {
      "name": "Kling AI",
      "desc": "Modèle de génération vidéo IA par Kuaishou — clips cinématographiques de haute fidélité.",
      "url": "https://klingai.com",
      "cats": [
        "ia",
        "video"
      ],
      "emoji": "🎬",
      "status": "freemium"
    },
    {
      "name": "ElevenLabs",
      "desc": "Synthèse vocale IA ultra-réaliste avec clonage de voix et support de nombreuses langues.",
      "url": "https://elevenlabs.io",
      "cats": [
        "ia",
        "sons"
      ],
      "emoji": "🎙️",
      "status": "freemium"
    },
    {
      "name": "TTSMaker",
      "desc": "Convertisseur texte-parole gratuit avec plus de 200 voix en plusieurs langues.",
      "url": "https://ttsmaker.com",
      "cats": [
        "ia",
        "sons"
      ],
      "emoji": "🔊",
      "status": "freemium",
      "noaccount": true
    },
    {
      "name": "Adobe Podcast Enhance",
      "desc": "Améliore automatiquement la qualité audio de vos enregistrements par IA — résultats studio.",
      "url": "https://podcast.adobe.com/enhance",
      "cats": [
        "ia",
        "sons"
      ],
      "emoji": "🎚️",
      "status": "freemium"
    },
    {
      "name": "Upscayl",
      "desc": "Logiciel open-source de mise à l'échelle d'images par IA, entièrement gratuit et local.",
      "url": "https://upscayl.org",
      "cats": [
        "ia",
        "outils",
        "opensource"
      ],
      "emoji": "🔍",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Upscale.media",
      "desc": "Service en ligne d'agrandissement d'images IA jusqu'à 4x sans perte de qualité visible.",
      "url": "https://www.upscale.media",
      "cats": [
        "ia",
        "outils"
      ],
      "emoji": "🔬",
      "status": "freemium"
    },
    {
      "name": "PhotoRoom",
      "desc": "Suppression d'arrière-plan et création de visuels produit par IA, très précis et rapide.",
      "url": "https://www.photoroom.com",
      "cats": [
        "ia",
        "outils"
      ],
      "emoji": "📱",
      "status": "freemium"
    },
    {
      "name": "Cleanup.pictures",
      "desc": "Supprimez des objets, personnes ou textes indésirables de vos photos par IA en secondes.",
      "url": "https://cleanup.pictures",
      "cats": [
        "ia",
        "outils"
      ],
      "emoji": "🧹",
      "status": "freemium"
    },
    {
      "name": "TinyPNG",
      "desc": "Compressez vos PNG et JPEG — réduction de taille impressionnante sans perte visible de qualité.",
      "url": "https://tinypng.com",
      "cats": [
        "outils"
      ],
      "emoji": "🐼",
      "status": "freemium",
      "noaccount": true
    },
    {
      "name": "Compressor.io",
      "desc": "Compression d'images JPEG, PNG, GIF et SVG en ligne avec contrôle qualité précis.",
      "url": "https://compressor.io",
      "cats": [
        "outils"
      ],
      "emoji": "🗜️",
      "status": "freemium",
      "noaccount": true
    },
    {
      "name": "Convertio",
      "desc": "Convertissez plus de 300 formats de fichiers en ligne — images, vidéos, audio, docs.",
      "url": "https://convertio.co",
      "cats": [
        "outils"
      ],
      "emoji": "🔄",
      "status": "freemium",
      "noaccount": true
    },
    {
      "name": "CloudConvert",
      "desc": "Conversion de fichiers en ligne avec support de 200+ formats et API disponible.",
      "url": "https://cloudconvert.com",
      "cats": [
        "outils"
      ],
      "emoji": "☁️",
      "status": "freemium",
      "noaccount": true
    },
    {
      "name": "iLovePDF",
      "desc": "Suite d'outils PDF en ligne — fusionner, compresser, convertir, éditer et signer.",
      "url": "https://www.ilovepdf.com",
      "cats": [
        "outils"
      ],
      "emoji": "❤️",
      "status": "freemium",
      "noaccount": true
    },
    {
      "name": "Smallpdf",
      "desc": "Outils PDF simples et efficaces pour compresser, éditer et convertir vos fichiers.",
      "url": "https://smallpdf.com",
      "cats": [
        "outils"
      ],
      "emoji": "📄",
      "status": "freemium",
      "noaccount": true
    },
    {
      "name": "OBS Studio",
      "desc": "Logiciel open-source professionnel d'enregistrement et de streaming vidéo, entièrement gratuit.",
      "url": "https://obsproject.com",
      "cats": [
        "outils",
        "video",
        "opensource"
      ],
      "emoji": "🎥",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Ezgif",
      "desc": "Créez, optimisez et éditez des GIFs dans le navigateur — sans inscription ni installation.",
      "url": "https://ezgif.com",
      "cats": [
        "outils"
      ],
      "emoji": "🎞️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "ScreenRec",
      "desc": "Enregistreur d'écran gratuit avec partage instantané de captures et vidéos.",
      "url": "https://screenrec.com",
      "cats": [
        "outils"
      ],
      "emoji": "📹",
      "status": "freemium"
    },
    {
      "name": "UI Avatars",
      "desc": "Générez des avatars avec initiales personnalisables via URL ou CSS pour vos prototypes.",
      "url": "https://ui-avatars.com",
      "cats": [
        "outils",
        "web"
      ],
      "emoji": "👤",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "DiceBear",
      "desc": "Générateur d'avatars vectoriels open-source avec des dizaines de styles artistiques distincts.",
      "url": "https://dicebear.com",
      "cats": [
        "outils",
        "web",
        "icones",
        "opensource"
      ],
      "emoji": "🎲",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Lorem Picsum",
      "desc": "API d'images placeholder en haute résolution pour maquettes, prototypes et dev.",
      "url": "https://picsum.photos",
      "cats": [
        "outils",
        "web",
        "opensource"
      ],
      "emoji": "🖼️",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "HandBrake",
      "desc": "Encodeur vidéo open-source gratuit pour convertir et compresser tous formats vidéo.",
      "url": "https://handbrake.fr",
      "cats": [
        "outils",
        "video",
        "opensource"
      ],
      "emoji": "🖐️",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "uiGradients",
      "desc": "Collection de dégradés CSS tendance avec code copiable en un clic pour vos projets.",
      "url": "https://uigradients.com",
      "cats": [
        "web",
        "couleurs"
      ],
      "emoji": "🌈",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "WebGradients",
      "desc": "180 dégradés CSS linéaires librement copiables pour arrière-plans et interfaces.",
      "url": "https://webgradients.com",
      "cats": [
        "web",
        "couleurs"
      ],
      "emoji": "🎨",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Blobmaker",
      "desc": "Générateur de formes blob SVG aléatoires pour ajouter organicité et relief à vos designs.",
      "url": "https://www.blobmaker.app",
      "cats": [
        "web"
      ],
      "emoji": "🫧",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Shape Divider",
      "desc": "Créez des séparateurs de sections SVG stylisés pour transitions de mise en page web.",
      "url": "https://www.shapedivider.app",
      "cats": [
        "web"
      ],
      "emoji": "📐",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "fffuel",
      "desc": "Suite de générateurs SVG créatifs — confettis, flèches, grilles, mesh et dégradés.",
      "url": "https://fffuel.co",
      "cats": [
        "web"
      ],
      "emoji": "⚡",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Get Waves",
      "desc": "Générateur de vagues SVG personnalisables pour transitions et fonds de pages web.",
      "url": "https://getwaves.io",
      "cats": [
        "web"
      ],
      "emoji": "🌊",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Glassmorphism CSS",
      "desc": "Générateur d'effets glassmorphism CSS prêts à l'emploi pour interfaces modernes.",
      "url": "https://glassmorphism.com",
      "cats": [
        "web"
      ],
      "emoji": "🪟",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Smooth Shadow",
      "desc": "Générateur d'ombres CSS douces et réalistes par couches, avec prévisualisation en direct.",
      "url": "https://shadows.brumm.af",
      "cats": [
        "web"
      ],
      "emoji": "🌑",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "LottieFiles",
      "desc": "Bibliothèque d'animations Lottie légères et interactives pour le web et les applications.",
      "url": "https://lottiefiles.com",
      "cats": [
        "web",
        "design"
      ],
      "emoji": "✨",
      "status": "freemium"
    },
    {
      "name": "Rive",
      "desc": "Créez des animations interactives avec machines d'état pour web et applications natives.",
      "url": "https://rive.app",
      "cats": [
        "web",
        "design"
      ],
      "emoji": "🌀",
      "status": "freemium"
    },
    {
      "name": "SVGator",
      "desc": "Outil en ligne pour créer et exporter des animations SVG complexes sans coder.",
      "url": "https://www.svgator.com",
      "cats": [
        "web",
        "design"
      ],
      "emoji": "🎬",
      "status": "freemium"
    },
    {
      "name": "Grafikart",
      "desc": "Plateforme française de tutoriels vidéo sur le design, le développement web et la créativité.",
      "url": "https://grafikart.fr",
      "cats": [
        "tutos",
        "web"
      ],
      "emoji": "🇫🇷",
      "status": "freemium",
      "noaccount": true
    },
    {
      "name": "CSS-Tricks",
      "desc": "Blog de référence pour CSS, HTML et JavaScript avec guides approfondis et almanach interactif.",
      "url": "https://css-tricks.com",
      "cats": [
        "tutos",
        "web"
      ],
      "emoji": "🎩",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Smashing Magazine",
      "desc": "Magazine en ligne de référence pour designers et développeurs — articles, guides et livres.",
      "url": "https://www.smashingmagazine.com",
      "cats": [
        "tutos",
        "web"
      ],
      "emoji": "💥",
      "status": "freemium"
    },
    {
      "name": "Codrops",
      "desc": "Blog créatif avec tutoriels et démos d'interfaces web innovantes — la référence du CSS avancé.",
      "url": "https://tympanus.net/codrops",
      "cats": [
        "tutos",
        "web"
      ],
      "emoji": "💧",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Envato Tuts+",
      "desc": "Milliers de tutoriels gratuits en design, développement, photo et vidéo sur Envato.",
      "url": "https://tutsplus.com",
      "cats": [
        "tutos"
      ],
      "emoji": "📚",
      "status": "freemium"
    },
    {
      "name": "FreeCodeCamp",
      "desc": "Plateforme d'apprentissage du développement web entièrement gratuite, open-source et certifiante.",
      "url": "https://www.freecodecamp.org",
      "cats": [
        "tutos",
        "web",
        "opensource"
      ],
      "emoji": "🔥",
      "status": "free",
      "opensource": true
    },
    {
      "name": "OpenClassrooms",
      "desc": "Plateforme FR de formation en ligne — design, développement, marketing et data.",
      "url": "https://openclassrooms.com",
      "cats": [
        "tutos"
      ],
      "emoji": "🎓",
      "status": "freemium"
    },
    {
      "name": "Spoon Graphics",
      "desc": "Blog de tutoriels Illustrator et Photoshop avec freebies et ressources design réguliers.",
      "url": "https://blog.spoongraphics.co.uk",
      "cats": [
        "tutos",
        "design"
      ],
      "emoji": "🥄",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Motion Café",
      "desc": "Ressources et tutoriels francophones dédiés au motion design et à After Effects.",
      "url": "https://www.motion-cafe.com/",
      "cats": [
        "tutos",
        "motion"
      ],
      "emoji": "☕",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Muzli",
      "desc": "Extension navigateur et site d'inspiration design qui agrège le meilleur du web créatif.",
      "url": "https://muz.li",
      "cats": [
        "inspi"
      ],
      "emoji": "🎵",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Refero",
      "desc": "Collection d'interfaces d'applications réelles pour s'inspirer des meilleurs patterns UX.",
      "url": "https://refero.design",
      "cats": [
        "inspi"
      ],
      "emoji": "📱",
      "status": "freemium"
    },
    {
      "name": "UI Movement",
      "desc": "Collection d'animations et d'interactions UI remarquables soumises par la communauté.",
      "url": "https://uimovement.com",
      "cats": [
        "inspi"
      ],
      "emoji": "🔄",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Designspiration",
      "desc": "Moteur de recherche visuel pour s'inspirer en design graphique, branding et illustration.",
      "url": "https://www.designspiration.com",
      "cats": [
        "inspi"
      ],
      "emoji": "🔍",
      "status": "free"
    },
    {
      "name": "Page Flows",
      "desc": "Bibliothèque de flows UX et onboarding d'applications réelles pour s'inspirer.",
      "url": "https://pageflows.com",
      "cats": [
        "inspi"
      ],
      "emoji": "📖",
      "status": "freemium"
    },
    {
      "name": "Httpster",
      "desc": "Galerie de sites web inspirants au design fort, triés par catégorie et style.",
      "url": "https://httpster.net",
      "cats": [
        "inspi"
      ],
      "emoji": "🌐",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Mixkit Templates",
      "desc": "Templates After Effects, Premiere Pro et DaVinci Resolve gratuits pour créateurs de contenu.",
      "url": "https://mixkit.co/free-after-effects-templates/",
      "cats": [
        "motion"
      ],
      "emoji": "🎬",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "FootageCrate",
      "desc": "Effets VFX, overlays et éléments visuels gratuits pour compositions et montages vidéo.",
      "url": "https://footagecrate.com",
      "cats": [
        "motion",
        "video"
      ],
      "emoji": "🎥",
      "status": "freemium"
    },
    {
      "name": "Videezy",
      "desc": "Banque de vidéos stock et éléments motion graphics gratuits — footage HD et 4K.",
      "url": "https://www.videezy.com",
      "cats": [
        "motion",
        "video"
      ],
      "emoji": "🎞️",
      "status": "freemium"
    },
    {
      "name": "ActionVFX Free",
      "desc": "Éléments VFX professionnels gratuits — feux, fumée, explosions et particules.",
      "url": "https://www.actionvfx.com/collections/free-vfx",
      "cats": [
        "motion"
      ],
      "emoji": "💥",
      "status": "free"
    },
    {
      "name": "FreshLUTs",
      "desc": "LUTs de color grading gratuits pour Premiere, DaVinci Resolve, FCPX et Lightroom.",
      "url": "https://freshluts.com",
      "cats": [
        "motion"
      ],
      "emoji": "🎨",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Life of Vids",
      "desc": "Vidéos de stock gratuites sous licence CC0 pour usage commercial sans attribution requise.",
      "url": "https://www.lifeofvids.com",
      "cats": [
        "video",
        "motion"
      ],
      "emoji": "🎬",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Videvo",
      "desc": "Banque de vidéos stock et footage HD/4K gratuits avec différentes licences disponibles.",
      "url": "https://www.videvo.net",
      "cats": [
        "video",
        "motion"
      ],
      "emoji": "🎥",
      "status": "freemium"
    },
    {
      "name": "Dareful",
      "desc": "Vidéos stock 4K sous licence CC0 — paysages, architectures et scènes urbaines cinématographiques.",
      "url": "https://dareful.com",
      "cats": [
        "video"
      ],
      "emoji": "🌅",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Motion Array Free",
      "desc": "Templates gratuits After Effects, Premiere et DaVinci Resolve par Motion Array.",
      "url": "https://motionarray.com/browse/?q=&free=true",
      "cats": [
        "motion"
      ],
      "emoji": "🎬",
      "status": "freemium"
    },
    {
      "name": "Velosofy",
      "desc": "Templates After Effects et intro logo gratuits pour créateurs de contenu YouTube.",
      "url": "https://www.velosofy.com",
      "cats": [
        "motion"
      ],
      "emoji": "⚡",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Jitter",
      "desc": "Outil de motion design web pour créer des animations UI, intros et présentations.",
      "url": "https://jitter.video",
      "cats": [
        "motion",
        "web",
        "design"
      ],
      "emoji": "💫",
      "status": "freemium"
    },
    {
      "name": "Blendswap",
      "desc": "Communauté de partage de modèles Blender 3D sous différentes licences Creative Commons.",
      "url": "https://www.blendswap.com",
      "cats": [
        "3d",
        "jeux"
      ],
      "emoji": "🔀",
      "status": "free"
    },
    {
      "name": "BlenderKit",
      "desc": "Bibliothèque de modèles, matériaux et HDRIs intégrée directement dans Blender.",
      "url": "https://www.blenderkit.com",
      "cats": [
        "3d"
      ],
      "emoji": "🧊",
      "status": "freemium"
    },
    {
      "name": "Free3D",
      "desc": "Des milliers de modèles 3D gratuits téléchargeables dans de nombreux formats.",
      "url": "https://free3d.com",
      "cats": [
        "3d"
      ],
      "emoji": "🗿",
      "status": "freemium"
    },
    {
      "name": "CGTrader Free",
      "desc": "Sélection de modèles 3D gratuits sur la grande marketplace CGTrader.",
      "url": "https://www.cgtrader.com/free-3d-models",
      "cats": [
        "3d"
      ],
      "emoji": "🎭",
      "status": "freemium"
    },
    {
      "name": "KitBash3D Cargo",
      "desc": "Plateforme gratuite de KitBash3D avec des assets 3D de qualité studio hollywoodien.",
      "url": "https://cargo.kitbash3d.com",
      "cats": [
        "3d"
      ],
      "emoji": "📦",
      "status": "free"
    },
    {
      "name": "Greyscalegorilla Free",
      "desc": "Ressources 3D gratuites pour Cinema 4D — HDRI, matériaux PBR et scènes par GSG.",
      "url": "https://greyscalegorilla.com/free/",
      "cats": [
        "3d"
      ],
      "emoji": "🦍",
      "status": "freemium"
    },
    {
      "name": "Wikimedia Commons",
      "desc": "Médiathèque libre avec plus de 100M d'images, vidéos et sons sous licences libres ou domaine public.",
      "url": "https://commons.wikimedia.org/",
      "cats": [
        "images",
        "illustrations",
        "video",
        "sons",
        "opensource"
      ],
      "emoji": "📚",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "NASA Image Library",
      "desc": "Banque officielle d'images, vidéos et sons de la NASA — entièrement domaine public.",
      "url": "https://images.nasa.gov/",
      "cats": [
        "images",
        "video",
        "sons"
      ],
      "emoji": "🚀",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "The Met Open Access",
      "desc": "Plus de 490 000 œuvres d'art du Metropolitan Museum sous licence CC0 — peintures, gravures, objets.",
      "url": "https://www.metmuseum.org/art/collection/search#!?showOnly=openAccess",
      "cats": [
        "images",
        "illustrations",
        "inspi"
      ],
      "emoji": "🖼️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Smithsonian Open Access",
      "desc": "4,5M d'images du Smithsonian (musées, archives) en CC0 — art, sciences, histoire.",
      "url": "https://www.si.edu/openaccess",
      "cats": [
        "images",
        "illustrations"
      ],
      "emoji": "🏛️",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "The Public Domain Review",
      "desc": "Curation érudite d'œuvres et d'images du domaine public — illustrations vintage, gravures, photos historiques.",
      "url": "https://publicdomainreview.org/",
      "cats": [
        "images",
        "illustrations",
        "inspi"
      ],
      "emoji": "📜",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "Pixelorama",
      "desc": "Éditeur de pixel art et d'animations open-source dans Godot — alternative gratuite et complète à Aseprite.",
      "url": "https://orama-interactive.itch.io/pixelorama",
      "cats": [
        "jeux",
        "outils",
        "opensource"
      ],
      "emoji": "🎨",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Excalidraw",
      "desc": "Outil de dessin et de schémas type tableau blanc, open-source, gratuit, sans compte.",
      "url": "https://excalidraw.com/",
      "cats": [
        "outils",
        "design",
        "opensource"
      ],
      "emoji": "✏️",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "draw.io",
      "desc": "Diagrammes, flowcharts et wireframes en ligne — open-source, gratuit, sauvegarde locale ou cloud.",
      "url": "https://www.drawio.com/",
      "cats": [
        "outils",
        "web",
        "opensource"
      ],
      "emoji": "📊",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "tldraw",
      "desc": "Tableau blanc collaboratif minimaliste, open-source — esquisse rapide, schémas, partage instantané.",
      "url": "https://www.tldraw.com/",
      "cats": [
        "outils",
        "design",
        "opensource"
      ],
      "emoji": "🖍️",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "MDN Web Docs",
      "desc": "Documentation web de référence par Mozilla — HTML, CSS, JS, accessibilité, performance.",
      "url": "https://developer.mozilla.org/",
      "cats": [
        "tutos",
        "web",
        "opensource"
      ],
      "emoji": "📖",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Devicon",
      "desc": "Icônes des langages, frameworks et outils dev — open-source (MIT), parfait pour CV et portfolios.",
      "url": "https://devicon.dev/",
      "cats": [
        "icones",
        "web",
        "opensource"
      ],
      "emoji": "💻",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Tailwind CSS",
      "desc": "Framework CSS utility-first ultra populaire, open-source, doc et playground gratuits.",
      "url": "https://tailwindcss.com/",
      "cats": [
        "web",
        "opensource"
      ],
      "emoji": "🌬️",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "The Noun Project (icônes free)",
      "desc": "Section gratuite avec attribution de la grande bibliothèque d'icônes universelles.",
      "url": "https://thenounproject.com/browse/icons/",
      "cats": [
        "icones"
      ],
      "emoji": "🔣",
      "status": "freemium"
    },
    {
      "name": "Open Props",
      "desc": "Custom properties CSS open-source pour design systems rapides — couleurs, typographies, ombres.",
      "url": "https://open-props.style/",
      "cats": [
        "couleurs",
        "web",
        "design",
        "opensource"
      ],
      "emoji": "🎚️",
      "status": "free",
      "opensource": true,
      "noaccount": true
    },
    {
      "name": "Sonniss GameAudioGDC",
      "desc": "Packs gratuits annuels d'effets sonores HQ pour devs de jeux — usage commercial libre.",
      "url": "https://sonniss.com/gameaudiogdc",
      "cats": [
        "sons",
        "jeux"
      ],
      "emoji": "🔊",
      "status": "free",
      "noaccount": true
    },
    {
      "name": "OpenGameArt 3D",
      "desc": "Modèles 3D libres (CC) pour développeurs de jeux — section dédiée d'OpenGameArt.",
      "url": "https://opengameart.org/art-search-advanced?field_art_type_tid%5B%5D=10",
      "cats": [
        "3d",
        "jeux",
        "opensource"
      ],
      "emoji": "🗿",
      "status": "free",
      "noaccount": true,
      "opensource": true
    }
  ]
};
