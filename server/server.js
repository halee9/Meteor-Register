
Meteor.startup(function () {
    var category = [
        { _id: "Special", name: "Today's Special", background: "white", colume: 1 },
        { _id: "Teriyaki", name: "Teriyaki", background: "green", colume: 2 },
        { _id: "DeepFry", name: "Deep Fry", background: "orange", colume: 1 },
        { _id: "StirFry", name: "Stir Fry", background: "red", colume: 3 },
        { _id: "Wok", name: "Chinese Wok", background: "yellow", colume: 4 },
        { _id: "Side", name: "Side", background: "blue", colume: 3 },
        { _id: "Mer", name: "Merchandises", background: "orange", colume: 2 }
    ];
    Categories.remove({});
    for (var i = 0; i < category.length; i++)
        Categories.insert(category[i]);


    var items = [
        { name: "Chicken Teriyaki", SKU: "CH T", price: 7.49, row: 1,  _category: "Teriyaki", job: "Grill",
        	_modifier: [ "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat" ], _replace: "chicken" },
        { name: "Spicy Chicken Teriyaki", SKU: "SP T", price: 7.99, row: 1,  _category: "Teriyaki", job: "Wok",
        	_modifier: [ "Spicy", "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat" ], _replace: "spicy_chicken", spicy: true },
        { name: "Chicken Breast Teriyaki", SKU: "BRST", price: 8.49, row: 1,  _category: "Teriyaki", job: "Grill",
        	_modifier: [ "Spicy$", "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat" ] },
        { name: "Beef Teriyaki", SKU: "BF T", price: 8.99, row: 1,  _category: "Teriyaki", job: "Wok", 
        	_modifier: [ "Spicy$", "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat" ], _replace: "beef" },
        { name: "Pork Teriyaki", SKU: "PK T", price: 8.99, row: 1,  _category: "Teriyaki", job: "Wok", 
        	_modifier: [ "Spicy$", "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat" ], _replace: "pork" },
        { name: "Salmon Teriyaki", SKU: "Salmon", price: 10.99, row: 1,  _category: "Teriyaki", job: "Grill",
        	_modifier: [ "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat" ] },
        { name: "Chicken Gyoza Eggroll", SKU: "CH+GZ+E", price: 9.99, row: 2,  _category: "Special", job: "Grill",
        	_modifier: [ "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat" ] },
        { name: "Spicy Gyoza eggroll", SKU: "SP+GZ+E", price: 10.49, row: 2,  _category: "Special", job: "Wok",
        	_modifier: [ "Spicy", "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat" ], spicy: true },
        { name: "General Gyoza", SKU: "Gen+GZ", price: 9.49, row: 2,  _category: "Special", job: "Wok",
        	_modifier: [ "Spicy", "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat" ], spicy: true },
        { name: "Crispy Gyoza", SKU: "Crsp+GZ", price: 9.49, row: 2,  _category: "Special", job: "Grill",
        	_modifier: [ "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat" ] },
        { name: "Chicken Yakisoba", SKU: "CH Yaki", price: 8.49, row: 3,  _category: "StirFry", job: "Wok", 
        	_modifier: [ "Spicy$", "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat", "Ex Veggie" ], _replace: "yakisoba" },
        { name: "Chicken Fried Rice", SKU: "CH FR", price: 8.49, row: 3,  _category: "StirFry", job: "Wok", 
        	_modifier: [ "Spicy$", "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat", "Ex Veggie" ], _replace: "fried_rice" },
        { name: "Veggie Stir Fry", SKU: "Veg SF", price: 8.49, row: 3,  _category: "StirFry", job: "Wok", 
        	_modifier: [ "Spicy$", "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat", "Ex Veggie" ], _replace: "stir_fry" },
        { name: "Chicken over Fried Rice", SKU: "CHoverFR", price: 8.99, row: 3,  _category: "StirFry", job: "Wok", 
        	_modifier: [ "Spicy$", "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat", "Ex Veggie" ], _replace: "over_fried_rice" },
        { name: "Chicken Katsu", SKU: "Katsu", price: 8.99, row: 2,  _category: "DeepFry", job: "Grill", 
        	_modifier: [ "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat" ], _replace: "katsu" },
        { name: "Crispy Chicken", SKU: "Crsp", price: 8.49, row: 2,  _category: "DeepFry", job: "Grill",
        	_modifier: [ "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat" ] },
        { name: "Gyoza Plate", SKU: "GZ PL", price: 7.49, row: 2,  _category: "DeepFry", job: "Grill",
        	_modifier: [ "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat" ] },
        { name: "General Tso Chicken", SKU: "General", price: 8.49, row: 4,  _category: "Wok", job: "Wok", 
        	_modifier: [ "Spicy", "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat" ], _replace: "general", spicy: true },
        { name: "Spicy Chicken and Mushroom", SKU: "SP CH+M", price: 8.49, row: 4,  _category: "Wok", job: "Wok", 
        	_modifier: [ "Spicy", "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat", "Ex Veggie" ], _replace: "spicy_mushroom", spicy: true },
        { name: "Chicken and Broccoli", SKU: "CH+Broc", price: 8.49, row: 4,  _category: "Wok", job: "Wok", 
        	_modifier: [ "Spicy$", "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat", "Ex Veggie" ], _replace: "chicken_broccoli" },
        { name: "Mongolian Beef", SKU: "Mongo", price: 8.99, row: 4,  _category: "Wok", job: "Wok",
        	_modifier: [ "Spicy$", "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat", "Ex Veggie" ] },
        { name: "Kung Pao Chicken", SKU: "Kung", price: 8.49, row: 4,  _category: "Wok", job: "Wok", 
        	_modifier: [ "Spicy$", "Rice/Salad", "Sauces", "Ex Fried", "Ex Meat", "Ex Veggie" ], _replace: "kung_pao", spicy: true },
        { name: "8 pieces Gyoza", SKU: "8PC GZ", price: 3.99, row: 3,  _category: "Side", job: "Grill",
        },
        { name: "2 pieces Egg Roll", SKU: "2PC Egg", price: 3.99, row: 3,  _category: "Side", job: "Grill",
        },
        { name: "Broccoli", SKU: "Brocc", price: 2.99, row: 4,  _category: "Side", job: "Grill",
        },
        { name: "Edamame", SKU: "Edamame", price: 3.49, row: 4,  _category: "Side", job: "Grill",
        },
        { name: "Drink", SKU: "Drink", price: 1.00, row: 1,  _category: "Mer", job: "Grill",
        	_replace: "mer" },
        { name: "Rice", SKU: "Rice", price: 2.00, row: 3,  _category: "Side", job: "Grill",
        	_replace: "side_rice" }
    ];
    Items.remove({});
    for (var i = 0; i < items.length; i++) {
        Items.insert(items[i]);
    }

    var replaces = [
        { _id: "chicken", 
        	name: "Chicken teriyaki modifier",
        	background: "orange",
        	action: "replace",
        	items: [
        		{ name: "Chicken Bowl", SKU: "CH Bowl", price: 4.99 },
        		{ name: "Chicken and Gyoza", SKU: "CH+GZ", price: 8.99 },
        		{ name: "Chicken and Eggroll", SKU: "CH+Egg", price: 8.99 },
        		{ name: "Chicken and Beef", SKU: "CH+BF", price: 9.49 },
        		{ name: "Chicken and Pork", SKU: "CH+PK", price: 9.49 },
        		{ name: "Chicken and Katsu", SKU: "CH+KT", price: 9.49 }
        	]
    	},
        { _id: "spicy_chicken", 
        	name: "Spicy chicken teriyaki modifier", 
        	background: "orange",
        	action: "replace",
        	items: [
        		{ name: "Spicy Chicken Bowl", SKU: "SP Bowl", price: 5.49 },
        		{ name: "Spicy Chicken and Gyoza", SKU: "SP+GZ", price: 8.99 },
        		{ name: "Spicy Chicken and Eggroll", SKU: "SP+Egg", price: 8.99 },
        		{ name: "Spicy Chicken and Beef", SKU: "SP+BF", price: 9.49 },
        		{ name: "Spicy Chicken and Pork", SKU: "SP+PK", price: 9.49 },
        		{ name: "Spicy Chicken and Katsu", SKU: "SP+KT", price: 9.49 }
        	]
    	},
        { _id: "beef", 
        	background: "orange",
        	name: "Beef teriyaki modifier", 
        	action: "replace",
        	items: [
        		{ name: "Beef Bowl", SKU: "BF Bowl", price: 5.49 }
        	]
    	},
        { _id: "pork", 
        	name: "Pork teriyaki modifier", 
        	background: "orange",
        	action: "replace",
        	items: [
        		{ name: "Pork Bowl", SKU: "PK Bowl", price: 5.49 }
        	]
    	},
        { _id: "katsu", 
        	name: "Katsu modifier", 
        	background: "orange",
        	action: "replace",
        	items: [
        		{ name: "Katsu and Gyoza", SKU: "KT+GZ", price: 9.49 },
        		{ name: "Katsu and Eggroll", SKU: "KT+Egg", price: 9.49 }
        	]
    	},
        { _id: "yakisoba", 
        	name: "Yakisoba modifier", 
        	background: "orange",
        	action: "replace",
        	items: [
        		{ name: "Beef Yakisoba", SKU: "BF Yaki", price: 9.49 },
        		{ name: "Pork Yakisoba", SKU: "PK Yaki", price: 9.49 },
        		{ name: "Tofu Yakisoba", SKU: "Tofu Yaki", price: 8.49 },
        		{ name: "Veggie Yakisoba", SKU: "Veg Yaki", price: 8.49 },
        		{ name: "Shrimp Yakisoba", SKU: "Shrimo Yaki", price: 10.49 }
        	]
        },
        { _id: "fried_rice", 
        	name: "Fried Rice modifier", 
        	background: "orange",
        	action: "replace",
        	items: [
        		{ name: "Beef Fried Rice", SKU: "BF FR", price: 9.49 },
        		{ name: "Pork Fried Rice", SKU: "PK FR", price: 9.49 },
        		{ name: "Tofu Fried Rice", SKU: "Tofu FR", price: 8.49 },
        		{ name: "Veggie Fried Rice", SKU: "Veg FR", price: 8.49 },
        		{ name: "Shrimp Fried Rice", SKU: "Shrimo FR", price: 10.49 }
        	]
    	},
        { _id: "stir_fry", 
        	name: "Veggie Stir Fry modifier", 
        	background: "orange",
        	action: "replace",
        	items: [
        		{ name: "Veggie Stir Fry Chicken", SKU: "Veg CH", price: 8.49 },
        		{ name: "Veggie Stir Fry Beef", SKU: "Veg BF", price: 9.49 },
        		{ name: "Veggie Stir Fry Pork", SKU: "Veg PK", price: 9.49 },
        		{ name: "Veggie Stir Fry Tofu", SKU: "Veg Tofu", price: 8.49 },
        		{ name: "Veggie Stir Fry Shrimp", SKU: "Veg Shrimp", price: 10.49 }
        	]
    	},
        { _id: "over_fried_rice", 
        	name: "Over fried rice modifier", 
        	background: "orange",
        	action: "replace",
        	items: [
                { name: "Spicy Chicken over Fried Rice", SKU: "SPoverFR", price: 9.99 },
                { name: "Beef over Fried Rice", SKU: "BFoverFR", price: 9.99 },
        		{ name: "Pork over Fried Rice", SKU: "PKoverFR", price: 9.99 },
        		{ name: "Katsu over Fried Rice", SKU: "KToverFR", price: 9.99 },
        		{ name: "Salmon over Fried Rice", SKU: "SALoverFR", price: 11.99 }
        	]
    	},
        { _id: "general", 
        	name: "General modifier", 
        	background: "orange",
        	action: "replace",
        	items: [
        		{ name: "General Tofu", SKU: "Gen Tofu", price: 8.49 }
        	]
    	},
        { _id: "spicy_mushroom", 
        	name: "Spicy mushroom modifier", 
        	background: "orange",
        	action: "replace",
        	items: [
        		{ name: "Spicy Tofu and Mushroom", SKU: "SP Tofu+M", price: 8.49 },
        		{ name: "Spicy Beef and Mushroom", SKU: "SP BF+M", price: 9.49 },
        		{ name: "Spicy Pork and Mushroom", SKU: "SP PK+M", price: 9.49 },
        		{ name: "Spicy Shrimp and Mushroom", SKU: "SP Shrimp+M", price: 10.49 }
        	]
    	},
        { _id: "chicken_broccoli", 
        	name: "Chicken broccoli modifier", 
        	background: "orange",
        	action: "replace",
        	items: [
        		{ name: "Tofu and Broccoli", SKU: "Tofu+Broc", price: 8.49 },
        		{ name: "Beef and Broccoli", SKU: "BF+Broc", price: 9.49 },
        		{ name: "Pork and Broccoli", SKU: "PK+Broc", price: 9.49 },
        		{ name: "Shrimp and Broccoli", SKU: "Shrimp+Broc", price: 10.49 }
        	]
    	},
        { _id: "kung_pao", 
        	name: "Kung Pao modifier", 
        	background: "orange",
        	action: "replace",
        	items: [
        		{ name: "Kung Pao Tofu", SKU: "Kung Tofu", price: 8.49 }
        	]
        },
        { _id: "side_rice", 
            name: "Side Rice modifier", 
            background: "yellow",
            action: "replace",
            items: [
                { name: "Brown Rice", SKU: "Brown Rice", price: 3.00 },
                { name: "Fried Rice", SKU: "Fried Rice", price: 4.50 }
            ]
        },
        { _id: "mer", 
            name: "Merchandises", 
            background: "blue",
            action: "replace",
            items: [
                { name: "Drink $2", SKU: "Drink$2", price: 2.00 }
            ]
        }
    ];
    Replaces.remove({});
    for (var i = 0; i < replaces.length; i++) {
        Replaces.insert(replaces[i]);
    }

    var modifiers = [
        { _id: "Spicy$", 
            name: "Make-it-spicy modifier", 
            background: "red",
            action: "add",
            items: [
                { name: "Spicy", SKU: "Spicy", price: 0.50, default: true },
                { name: "Extra Spicy", SKU: "Ex Spicy", price: 0.50 },
                { name: "Mild Spicy", SKU: "Md Spicy", price: 0.50 },
                { name: "Both Spicy", SKU: "Both Spicy", price: 0.50 }
            ]
        },
        { _id: "Spicy", 
            name: "Make-it-spicy modifier", 
            background: "red",
            action: "add",
            items: [
                { name: "Extra Spicy", SKU: "Ex Spicy", price: 0.00, default: true },
                { name: "Mild Spicy", SKU: "Md Spicy", price: 0.00 },
                { name: "Both Spicy", SKU: "Both Spicy", price: 0.00 }
            ]
    	},
        { _id: "Rice/Salad", 
        	name: "Rice or Salad modifier", 
        	background: "green",
        	action: "add",
        	items: [
                { name: "Brown Rice", SKU: "Brown", price: 0.50, default: true },
                { name: "Fried Rice", SKU: "Fried Rice", price: 2.00 },
                { name: "No Salad", SKU: "No Salad", price: 0.00 },
                { name: "No Rice", SKU: "No Rice", price: 0.00 },
                { name: "More Rice", SKU: "More Rice", price: 0.00 },
                { name: "Half Rice", SKU: "Half Rice", price: 0.00 }
        	]
        },
        { _id: "Sauces", 
            name: "Sauces", 
            background: "yellow",
            action: "add",
            items: [
                { name: "No Sauce", SKU: "No Sauce", price: 0.00, default: true },
                { name: "Sauce on the Side", SKU: "TS On Side", price: 0.00 },
                { name: "Sauce on the Rice", SKU: "TS On Rice", price: 0.00 },
                { name: "Extra Teriyaki Sauce", SKU: "Ex TSauce", price: 0.00 },
                { name: "Extra Katsu Sauce", SKU: "Ex KTSauce", price: 0.00 },
                { name: "Extra Garlic Sauce", SKU: "Ex Garlic", price: 0.00 }
            ]
        },
        { _id: "Ex Fried", 
            name: "Extra Deep Fried", 
            background: "white",
            action: "add",
            items: [
                { name: "4 pieces Gyoza", SKU: "4PC GZ", price: 2.00 },
                { name: "1 piece Egg Roll", SKU: "1PC Egg", price: 2.00 }
            ]
        },
        { _id: "Ex Meat", 
            name: "Extra Meat", 
            background: "white",
            action: "add",
            items: [
                { name: "Extra Chicken", SKU: "Ex CH", price: 3.50 },
                { name: "Extra Breast", SKU: "Ex BRST", price: 3.50 },
                { name: "Extra Beef", SKU: "Ex BF", price: 3.50 },
                { name: "Extra Pork", SKU: "Ex PK", price: 3.50 },
                { name: "Extra Shrimp", SKU: "Ex Shrimp", price: 3.50 }
            ]
        },
        { _id: "Ex Veggie", 
            name: "Extra Veggie", 
            background: "white",
            action: "add",
            items: [
                { name: "Extra Tofu", SKU: "Ex Tofu", price: 2.00 },
                { name: "Extra Veggie", SKU: "Ex Veg", price: 2.00 },
                { name: "Extra Broccoli", SKU: "Ex Broc", price: 2.00 },
                { name: "Extra Mushroom", SKU: "Ex Mush", price: 2.00 },
                { name: "Extra Noodle", SKU: "Ex Noodle", price: 2.00 }
            ]
        }
    ];
    Modifiers.remove({});
    for (var i = 0; i < modifiers.length; i++)
        Modifiers.insert(modifiers[i]);




    setHourlyTotal();
    var now = moment()._d;
    Payments.find({created_at: {$gt: now}}).observe({
        added: function(order){
            setHourlyTotal();
        }
    });

});

function round2(value){
    var decimals = 2;
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function setHourlyTotal(){
    var today = moment().startOf('day')._d;
    var pipeline = [
        {$match: { created_at: {$gt: today}}},
        {$group: {_id:"$date.hour", total:{$sum:"$sum.total"}, credit:{$sum:"$credit"}, cash:{$sum:"$cash"}} }
        ];
    var result = Payments.aggregate(pipeline);
    var hourly = [];
    var total = { total: 0, cash: 0, credit: 0 };
    for (var i=0; i<result.length; i++){
        hourly.push({
            hour: result[i]._id, 
            total: round2(result[i].total), 
            cash: round2(result[i].cash), 
            credit: round2(result[i].credit)
        });
        total.total += round2(result[i].total);
        total.cash += round2(result[i].cash);
        total.credit += round2(result[i].credit);
    }
    total.total = round2(total.total);
    total.cash = round2(total.cash);
    total.credit = round2(total.credit);
    total.date = moment().format("YYYY/MM/DD");
    console.log(hourly);

    var d = moment().format("YYYYMMDD");
    var sale = Sales.findOne({_id:d});
    if (sale) {
        Sales.update({_id:d}, { daily: total, hourly: hourly });
    }
    else {
        Sales.insert({ _id: d, daily: total, hourly: hourly });
    }
    console.log(total);
}

