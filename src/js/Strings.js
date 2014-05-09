var FR = function() {
	// Tabs name
	this.TAB_HOME		= "Accueil";
	this.TAB_CLIENTS	= "Clients";
	this.TAB_ANIMALS	= "Animaux";
	this.TAB_PERF		= "Prestations";
	this.TAB_STOCKS		= "Stocks";

	// Commons
	this.CONFIRM_DELETE			= "Voulez vous vraiment supprimer";
	this.MESSAGE_SAVE_SUCESS	= "Les informations ont bien étées enregistrées";

	// Animals
	this.ANIMALS_LABEL_NAME		= "Nom";
	this.ANIMALS_LABEL_OWNERS	= "Propriétaires";
	this.ANIMALS_LABEL_TYPE		= "Type";
	this.ANIMALS_LABEL_RACE		= "Race";
	this.ANIMALS_LABEL_AGE		= "Âge";
	this.ANIMALS_LABEL_SIZE		= "Taille";
	this.ANIMALS_LABEL_COLOUR	= "Robe";
	this.ANIMALS_LABEL_PUCE		= "N° de puce";

	this.ANIMALS_REQUIRE_NAME		= "Le nom de l'animal est nécessaire";
	this.ANIMALS_REQUIRE_TYPE		= "Le type de l'animal est nécessaire";
	this.ANIMALS_REQUIRE_RACE		= "La race de l'animal est nécessaire";
	this.ANIMALS_WRONG_DATE_FORMAT	= "La date de naissance de l'animal est vide ou mal formattée";
	this.ANIMALS_REQUIRE_JOB		= "L'animal doit au moins apartenir à l'une des catégories suivantes:\nMaréchalerie ou Pension";

	// Clients
	this.CLIENTS_LABEL_NAME				= "Nom";
	this.CLIENTS_LABEL_ANIMALS 			= "Animaux";
	this.CLIENTS_LABEL_PHONE_MOBILE 	= "Portable";
	this.CLIENTS_LABEL_PHONE_FIXE 		= "Fixe";
	this.CLIENTS_LABEL_ADDRESS 			= "Adresse";
	this.CLIENTS_LABEL_ZIPCODE 			= "Code Postal";
	this.CLIENTS_LABEL_CITY 			= "Ville";

	this.CLIENTS_REQUIRE_NAME		= "Les nom et prénom du client sont nécessaires";
	this.CLIENTS_REQUIRE_ADDRESS	= "L'addresse du client est nécessaire";
	this.CLIENTS_REQUIRE_ZIPCODE	= "La code postal du client est nécessaire";
	this.CLIENTS_REQUIRE_JOB		= "Le client doit au moins apartenir à l'une des catégories suivantes:\nMaréchalerie ou Pension";

	// Performances
	this.PERF_LABEL_NAME	= "Nom";
	this.PERF_LABEL_PRICE	= "Prix";
	this.PERF_LABEL_TVA		= "TVA";
	this.PERF_LABEL_UNIT	= "Unité";

	this.PERF_REQUIRE_NAME		= "Le nom de la prestation est nécessaire";
	this.PERF_REQUIRE_PRICE		= "Le prix de la prestation est nécessaire";
	this.PERF_REQUIRE_TVA		= "La TVA de la prestation est nécessaire";
	this.PERF_REQUIRE_UNIT		= "L'unité est nécessaire";
	this.PERF_REQUIRE_JOB		= "La prestation doit au moins apartenir à l'une des catégories suivantes:\nMaréchalerie ou Pension";

	// Settings
	this.SETTINGS_USER_REQUIRE_NAME			= "Les nom et prénom sont nécessaires";
	this.SETTINGS_USER_REQUIRE_ADDRESS		= "L'addresse est nécessaire";
	this.SETTINGS_USER_REQUIRE_ZIPCODE		= "La code postal est nécessaire";
	this.SETTINGS_USER_REQUIRE_MAIL			= "L'addresse mail est nécessaire";
	this.SETTINGS_USER_MAIL_WRONG_FORMAT	= "Le format de l'adresse mail est invalide";
	this.SETTINGS_USER_REQUIRE_PHONE		= "Il faut au moins un numéro de téléphone";
	this.SETTINGS_USER_REQUIRE_COMPANY		= "Le nom de l'entreprise est nécessaire";

	// Autocompletes values
	this.PERF_AUTOCOMPLETE_UNITY		= [
		"Boîte",
		"Tonne",
		"Unité",
	];

	this.ANIMALS_AUTOCOMPLETE_TYPE		= [
		"Cheval de trait",
		"Cheval de selle",
		"Poney",
		"Shetland",
		"Mule / Bardot",
		"Âne",
		"Zèbre"
	];
	this.ANIMALS_AUTOCOMPLETE_RACE		= [
		"Pur-sang Arabe",
		"Pur-sang Anglais",
		"Selle Français",
		"Trotteur Français",
		"AQPS",
		"Anglo-Arabe",
		"Lusitanien",
		"Lipizzan",
		"PRE",
		"Trakehner",
		"Barbe",
		"Camargue",
		"Mérens",
		"Fjord",
		"Henson",
		"Islandais",
		"Quaterhorse",
		"Appaloosa",
		"Paint horse",
		"Connemara",
		"New forest",
		"Poney landais",
		"Poney français de selle",
		"Haflinger",
		"Dartmoore",
		"Pottok",
		"Highland",
		"Welsh",
		"Shetland",
		"Falabella",
		"Le cheval miniature",
		"Percheron",
		"Ardennais",
		"Boulonnais",
		"Trait du Nord",
		"Cob Normand",
		"Comtois",
		"Trait Breton",
		"Poitevin Mulassier",
		"Âne Normand",
		"Âne de Provence",
		"Âne des Pyrénées",
		"Âne du Cotentin",
		"Baudet du Poitou",
		"Grand noir du Berry",
		"Mule Poitevine",
		"Mule des Pyrénées",
		"Mule Seynarde",
		"Mule Savoyarde",
		"ONC"
	];
	this.ANIMALS_AUTOCOMPLETE_COLOUR	= [
		"Noir",
		"Noir pangaré",
		"Noir grisonnant",
		"Bai clair",
		"Bai foncé",
		"Bai brun",
		"Bai cerise",
		"Bai grisonnant",
		"Isabelle clair",
		"Isabelle foncé",
		"Bai sourris",
		"Alezan brûlé",
		"Alezan foncé",
		"Alezan cuivré",
		"Alezan grisonnant",
		"Café au lait",
		"Palomino",
		"Blanc",
		"Crémello",
		"Perlino",
		"Gris",
		"Gris vlair",
		"Gris foncé",
		"Gris truité",
		"Gris mouchetté",
		"Gris tourterelle",
		"Chocolat",
		"Rouan",
		"Aubère",
		"Louvet",
		"Champagne",
		"Pomelé",
		"Floconné",
		"Pie noir",
		"Pie bai",
		"Pie alezan",
		"Pie gris",
		"Pie palomino",
		"Pie tobiano",
		"Pie overo",
		"Pie tovero",
		"Tâcheté léopard",
		"Tâcheté cape",
		"Tâcheté marmoré",
		"Tâcheté rayé",
		"Tâcheté bringé"
	];
	this.ANIMALS_AUTOCOMPLETE_HEAD_MARK	= [
		 "Losange",
		"Pelote",
		"Etoile",
		"Croissant",
		"Fleur de lys",
		"Poire renversée",
		"Fer de lance",
		"Coeur",
		"Liste fine",
		"Liste normale",
		"Liste large",
		"Liste interrompue",
		"Liste courte",
		"Liste déviée",
		"Liste débordante",
		"Liste belle face",
		"Ladres"
	];
	this.ANIMALS_AUTOCOMPLETE_FOOT_MARK	= [
		"Trace de balzane",
		"En courronne",
		"Bracelet",
		"Petite Balzane",
		"Grande balzane",
		"Balzane chaussette",
		"Balzane haut-chaussée",
		"Balzane herminée",
		"Zébrures"
	];
};

var Strings = new FR();