var FR = function() {
	// Tabs name
	this.TAB_HOME		= "Accueil";
	this.TAB_CLIENTS	= "Clients";
	this.TAB_ANIMALS	= "Animaux";
	this.TAB_PERF		= "Prestations";
	this.TAB_STOCKS		= "Stocks";
	this.TAB_BILLS		= "Factures";

	// Commons
	this.CONFIRM_DELETE				= "Voulez vous vraiment supprimer $1 ?";
	this.MESSAGE_SAVE_SUCESS		= "Les informations ont bien étées enregistrées";
	this.REMOVE_FROM_LIST			= "Retirer de la liste";
	this.REMOVE						= "Supprimer";
	this.EDIT						= "Modifier";
	this.MODIFY_QUANTITY			= "Modifier la quantité";
	this.SETTINGS					= "Paramètres";

	// Home
	this.HISTORY_LABEL_DATE		= "Date";
	this.HISTORY_LABEL_CATEGORY	= "Categorie";
	this.HISTORY_LABEL_ACTION	= "Action";

	this.HISTORY_SENTENCE_ADD						= "La fiche de $1 a été créée";
	this.HISTORY_SENTENCE_BILL_ADD					= "La facture $1 a été générée";
	this.HISTORY_SENTENCE_BILL_DELETE				= "La facture $1 a été suprimée";
	this.HISTORY_SENTENCE_PERF_ADD					= "La prestation $1 a été créée";
	this.HISTORY_SENTENCE_EDIT						= "La fiche de $1 a été modifiée";
	this.HISTORY_SENTENCE_PERF_EDIT					= "La prestation $1 a été modifiée";
	this.HISTORY_SENTENCE_SETTINGS_OWNER			= "Les informations de la société ont été modifiées";
	this.HISTORY_SENTENCE_SETTINGS_SECURITY			= "La sauvegarde automatique des données à été modifiée";
	this.HISTORY_SENTENCE_SETTINGS_SECURITY_SAVE	= "La base de donnée à été sauvegardée";
	this.HISTORY_SENTENCE_DELETE					= "La fiche de $1 a été suprimée";
	this.HISTORY_SENTENCE_PERF_DELETE				= "La prestation $1 a été suprimée";
	this.HISTORY_SENTENCE_ADD_PERF					= "La prestation '$2' a été associée à $1";
	this.HISTORY_SENTENCE_EDIT_PERF					= "La quantité de la prestation '$2' a été modifiée pour $1";
	this.HISTORY_SENTENCE_DELETE_PERF				= "La prestation '$2' a été dissocié de $1";
	this.HISTORY_SENTENCE_ADD_ANIMAL				= "$2 a été associé à $1";
	this.HISTORY_SENTENCE_DELETE_ANIMAL				= "$2 a été dissocié de $1";
	this.HISTORY_SENTENCE_ADD_ALERT					= "L'alerte '$2' a été associée à $1";
	this.HISTORY_SENTENCE_EDIT_ALERT				= "L'alerte '$2' a été modifiée pour $1";
	this.HISTORY_SENTENCE_DELETE_ALERT				= "L'alerte '$2' a été dissociée de $1";
	this.HISTORY_SENTENCE_STOCK_ADD					= "Le stock $1 a été créé";
	this.HISTORY_SENTENCE_STOCK_EDIT				= "Le stock $1 a été modifié";
	this.HISTORY_SENTENCE_STOCK_DELETE				= "Le stock $1 a été supprimé";
	this.HISTORY_SENTENCE_STOCK_QUANTITY			= "La quantité du stock $1 a été modifiée";

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
	this.ANIMALS_REQUIRE_DATE		= "La date de naissance de l'animal est nécessaire"
	this.ANIMALS_WRONG_DATE_FORMAT	= "La date de naissance de l'animal est mal formattée";
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
	this.CLIENTS_REQUIRE_CITY		= "La ville est nécessaire";
	this.CLIENTS_REQUIRE_JOB		= "Le client doit au moins apartenir à l'une des catégories suivantes:\nMaréchalerie ou Pension";

	// Performances
	this.PERF_LABEL_DATE		= "Date";
	this.PERF_LABEL_NAME		= "Nom";
	this.PERF_LABEL_PRICE_HT	= "Prix HT";
	this.PERF_LABEL_PRICE_TTC	= "Prix TTC";
	this.PERF_LABEL_TVA			= "TVA";
	this.PERF_LABEL_UNIT		= "Unité";
	this.PERF_LABEL_QUANTITY	= "Quantité";

	this.PERF_REQUIRE_NAME					= "Le nom de la prestation est nécessaire";
	this.PERF_REQUIRE_PRICE					= "Les prix de la prestation (TTC et HT) sont nécessaire";
	this.PERF_PRICE_WRONG_FORMAT			= "Les prix de la prestation (TTC et HT) doivent être des nombres";
	this.PERF_REQUIRE_TVA					= "La TVA de la prestation est nécessaire";
	this.PERF_TVA_WRONG_FORMAT				= "La TVA doit être un nombre";
	this.PERF_REQUIRE_UNIT					= "L'unité est nécessaire";
	this.PERF_DEFAULT_QUANTITY_WRONG_FORMAT	= "La quantité par défault doit être un nombre";
	this.PERF_REQUIRE_JOB					= "La prestation doit au moins apartenir à l'une des catégories suivantes:\nMaréchalerie ou Pension";

	// Bills
	this.BILLS_LABEL_NUMBER		= "N° de facture";
	this.BILLS_LABEL_DATE		= "Date";
	this.BILLS_LABEL_CLIENT		= "Client";
	this.BILLS_LABEL_TAXFREE	= "Total HT";
	this.BILLS_LABEL_TOTAL		= "Total TTC";
	this.BILLS_LABEL_FILE		= "Fichier";

	this.EXTRA_TITLE			= "Montant du supplément";
	this.DISCOUNT_TITLE			= "Montant de la remise";
	this.EXTRA_LABEL			= "Supplément: $1€";
	this.DISCOUNT_LABEL			= "Remise: $1€";

	this.CONFIRM_DELETE_BILL		= "Voulez vous vraiment supprimer la facture $1 ?";
	this.CONFIRM_DELETE_BILL_FILE	= "Voulez-vous également supprimer le ficher relatif à la facture ?";

	// Stoks
	this.STOCKS_LABEL_NAME				= "Nom";
	this.STOCKS_LABEL_QUANTITY			= "Quantité";
	this.STOCKS_LABEL_QUANTITY_ALERT	= "Alerte à partir de";
	this.STOCKS_LABEL_ACTION			= "Actions";
	this.STOCKS_LABEL_UNITY				= "Unité";

	this.STOCKS_REQUIRE_NAME			= "Le nom du stock est nécessaire";
	this.STOCKS_REQUIRE_QUANTITY		= "La quantité est nécessaire";
	this.STOCKS_WRONG_QUANTITY			= "La quantité doit être un nombre";
	this.STOCKS_WRONG_QUANTITY_ALERT	= "L'alerte de quantité doit être un nombre";
	this.STOCKS_REQUIRE_UNITY			= "L'unité est nécessaire'";

	this.STOCKS_SENTENCE_ALERT			= "La quantité est trop faible";

	// Alerts
	this.ALERTS_LABEL_FREQUENCY	= "Fréquence";
	this.ALERTS_LABEL_FROM		= "A partir du";
	this.ALERTS_LABEL_TITLE		= "Titre";
	this.ALERTS_LABEL_DATE		= "Date";
	this.ALERTS_LABEL_CATEGORY	= "Catégorie";
	this.ALERTS_LABEL_NAME		= "Nom";
	this.ALERTS_LABEL_ADD		= "Ajouter une alerte";
	this.DAILY					= "Quotidienne";
	this.WEEKLY					= "Hebdomadaire";
	this.MONTHLY				= "Mensuelle";
	this.ALERTS_REQUIRE_TITLE	= "Un titre de moins de 255 caractères est nécessaire";
	this.ALERTS_REQUIRE_DATE	= "La date est vide ou le format est incorrect (jj/mm/aaaa)"

	// Settings
	this.SETTINGS_COMPANY_REQUIRE_NAME			= "Les nom et prénom sont nécessaires";
	this.SETTINGS_COMPANY_REQUIRE_ADDRESS		= "L'addresse est nécessaire";
	this.SETTINGS_COMPANY_REQUIRE_ZIPCODE		= "Le code postal est nécessaire";
	this.SETTINGS_COMPANY_REQUIRE_CITY			= "La ville est nécessaire";
	this.SETTINGS_COMPANY_REQUIRE_MAIL			= "L'addresse mail est nécessaire";
	this.SETTINGS_COMPANY_MAIL_WRONG_FORMAT		= "Le format de l'adresse mail est invalide";
	this.SETTINGS_COMPANY_REQUIRE_PHONE			= "Il faut au moins un numéro de téléphone";
	this.SETTINGS_COMPANY_REQUIRE_COMPANY		= "Le nom de l'entreprise est nécessaire";

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