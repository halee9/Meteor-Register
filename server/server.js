
Meteor.startup(function () {
    var category = [
        { _id: "Special", name: "Today's Special", background: "white", colume: 1 },
        { _id: "Teriyaki", name: "Teriyaki", background: "green", colume: 2 },
        { _id: "DeepFry", name: "Deep Fry", background: "orange", colume: 1 },
        { _id: "StirFry", name: "Stir Fry", background: "red", colume: 3 },
        { _id: "Wok", name: "Chinese Wok", background: "yellow", colume: 4 },
        { _id: "Side", name: "Side", background: "blue", colume: 3 },
        { _id: "Drink", name: "Beverage", background: "orange", colume: 2 }
    ];
    Categories.remove({});
    for (var i = 0; i < category.length; i++)
        Categories.insert(category[i]);


    var items = [
        { name: "Chicken Teriyaki", SKU: "CH T", price: 7.49, row: 1,  _category: "Teriyaki", job: "Grill",
        	_modifier: [ "brown", "rice_salad", "chicken", "addon" ] },
        { name: "Spicy Chicken Teriyaki", SKU: "SP T", price: 7.99, row: 1,  _category: "Teriyaki", job: "Wok",
        	_modifier: [ "spicy", "brown", "rice_salad","spicy_chicken",  "addon" ] },
        { name: "Chicken Breast Teriyaki", SKU: "BRST", price: 8.49, row: 1,  _category: "Teriyaki", job: "Grill",
        	_modifier: [ "spicy$", "brown", "rice_salad", "addon" ] },
        { name: "Beef Teriyaki", SKU: "BF T", price: 8.99, row: 1,  _category: "Teriyaki", job: "Wok", 
        	_modifier: [ "brown", "rice_salad", "spicy$", "beef", "addon" ] },
        { name: "Pork Teriyaki", SKU: "PK T", price: 8.99, row: 1,  _category: "Teriyaki", job: "Wok", 
        	_modifier: [ "brown", "rice_salad", "spicy$", "pork", "addon" ] },
        { name: "Salmon Teriyaki", SKU: "Salmon", price: 10.99, row: 1,  _category: "Teriyaki", job: "Grill",
        	_modifier: [ "brown", "rice_salad", "addon" ] },
        { name: "Chicken Gyoza Eggroll", SKU: "CH+GZ+E", price: 9.99, row: 2,  _category: "Special", job: "Grill",
        	_modifier: [ "brown", "rice_salad", "addon" ] },
        { name: "Spicy Gyoza eggroll", SKU: "SP+GZ+E", price: 10.49, row: 2,  _category: "Special", job: "Wok",
        	_modifier: [ "brown", "rice_salad", "addon", "spicy" ] },
        { name: "General Gyoza", SKU: "Gen+GZ", price: 9.49, row: 2,  _category: "Special", job: "Wok",
        	_modifier: [ "brown", "rice", "addon" ] },
        { name: "Crispy Gyoza", SKU: "Crsp+GZ", price: 9.49, row: 2,  _category: "Special", job: "Grill",
        	_modifier: [ "brown", "rice", "addon" ] },
        { name: "Chicken Yakisoba", SKU: "CH Yaki", price: 8.49, row: 3,  _category: "StirFry", job: "Wok", 
        	_modifier: [ "brown", "rice", "spicy$", "yakisoba", "addon" ] },
        { name: "Chicken Fried Rice", SKU: "CH FR", price: 8.49, row: 3,  _category: "StirFry", job: "Wok", 
        	_modifier: [ "spicy$", "fried_rice", "addon" ] },
        { name: "Veggie Stir Fry", SKU: "Veg SF", price: 8.49, row: 3,  _category: "StirFry", job: "Wok", 
        	_modifier: [ "brown", "rice", "spicy$", "stir_fry", "addon" ] },
        { name: "Chicken over Fried Rice", SKU: "CHoverFR", price: 8.99, row: 3,  _category: "StirFry", job: "Wok", 
        	_modifier: [ "spicy$", "over_fried_rice", "addon" ] },
        { name: "Chicken Katsu", SKU: "Katsu", price: 8.99, row: 2,  _category: "DeepFry", job: "Grill", 
        	_modifier: [ "brown", "rice_salad", "katsu", "addon" ] },
        { name: "Crispy Chicken", SKU: "Crsp", price: 8.49, row: 2,  _category: "DeepFry", job: "Grill",
        	_modifier: [ "brown", "rice", "addon" ] },
        { name: "Gyoza Plate", SKU: "GZ PL", price: 7.49, row: 2,  _category: "DeepFry", job: "Grill",
        	_modifier: [ "brown", "rice_salad", "addon" ] },
        { name: "General Tso Chicken", SKU: "General", price: 8.49, row: 4,  _category: "Wok", job: "Wok", 
        	_modifier: [ "general", "brown", "rice", "addon", "spicy" ] },
        { name: "Spicy Chicken and Mushroom", SKU: "SP CH+M", price: 8.49, row: 4,  _category: "Wok", job: "Wok", 
        	_modifier: [ "spicy_mushroom", "brown", "rice", "addon", "spicy" ] },
        { name: "Chicken and Broccoli", SKU: "CH+Broc", price: 8.49, row: 4,  _category: "Wok", job: "Wok", 
        	_modifier: [ "brown", "rice", "spicy$", "chicken_broccoli", "addon" ] },
        { name: "Mongolian Beef", SKU: "Mongo", price: 8.99, row: 4,  _category: "Wok", job: "Wok",
        	_modifier: [ "brown", "rice", "spicy$", "addon" ] },
        { name: "Kung Pao Chicken", SKU: "Kung", price: 8.49, row: 4,  _category: "Wok", job: "Wok", 
        	_modifier: [ "kung_pao", "brown", "rice", "addon", "spicy" ] },
        { name: "8 pieces Gyoza", SKU: "8PC GZ", price: 3.99, row: 3,  _category: "Side", job: "Grill",
        	_modifier: [ "addon" ] },
        { name: "2 pieces Egg Roll", SKU: "2PC Egg", price: 3.99, row: 3,  _category: "Side", job: "Grill",
        	_modifier: [ "addon" ] },
        { name: "Broccoli", SKU: "Brocc", price: 2.99, row: 4,  _category: "Side", job: "Grill",
        	_modifier: [ "addon" ] },
        { name: "Edamame", SKU: "Edamame", price: 3.49, row: 4,  _category: "Side", job: "Grill",
        	_modifier: [ "addon" ] },
        { name: "Drink", SKU: "Drink", price: 1.00, row: 1,  _category: "Drink", job: "Grill",
        	_modifier: [ "drink" ] },
        { name: "Rice", SKU: "Rice", price: 2.00, row: 3,  _category: "Side", job: "Grill",
        	_modifier: [ "side_rice" ] }
    ];
    Items.remove({});
    for (var i = 0; i < items.length; i++) {
        Items.insert(items[i]);
    }

    var modifier = [
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
        { _id: "spicy$", 
            name: "Make-it-spicy modifier", 
            background: "red",
            action: "add",
            items: [
                { name: "Spicy", SKU: "Spicy", price: 0.50 },
                { name: "Extra Spicy", SKU: "Ex Spicy", price: 0.50 },
                { name: "Mild Spicy", SKU: "Md Spicy", price: 0.50 }
            ]
        },
        { _id: "spicy", 
            name: "Make-it-spicy modifier", 
            background: "red",
            action: "add",
            items: [
                { name: "Extra Spicy", SKU: "Ex Spicy", price: 0.00 },
                { name: "Mild Spicy", SKU: "Md Spicy", price: 0.00 }
            ]
    	},
        { _id: "brown", 
        	name: "Brown rice modifier", 
        	background: "yellow",
        	action: "add",
        	items: [
        		{ name: "Brown Rice", SKU: "Brown", price: 0.50 }
        	]
    	},
        { _id: "rice_salad", 
        	name: "Rice or Salad modifier", 
        	background: "green",
        	action: "add",
        	items: [
        		{ name: "No Rice", SKU: "No Rice", price: 0.00 },
        		{ name: "No Salad", SKU: "No Salad", price: 0.00 }
        	]
    	},
        { _id: "rice", 
        	name: "Rice modifier", 
        	background: "green",
        	action: "add",
        	items: [
        		{ name: "No Rice", SKU: "No Rice", price: 0.00 }
        	]
    	},
        { _id: "side_rice", 
        	name: "Side Rice modifier", 
        	background: "yellow",
        	action: "replace",
        	items: [
        		{ name: "Brown Rice", SKU: "Brown Rice", price: 3.00 }
        	]
    	},
        { _id: "drink", 
        	name: "Drink modifier", 
        	background: "blue",
        	action: "replace",
        	items: [
        		{ name: "Drink $2", SKU: "Drink2", price: 2.00 }
        	]
    	},
        { _id: "addon", 
        	name: "Add On", 
        	background: "white",
        	action: "add",
        	items: [
        		{ name: "4 pieces Gyoza", SKU: "4PC GZ", price: 2.00 },
        		{ name: "1 piece Egg Roll", SKU: "1PC Egg", price: 2.00 },
        		{ name: "Extra Chicken", SKU: "Ex CH", price: 3.50 },
        		{ name: "Extra Beef", SKU: "Ex BF", price: 3.50 },
        		{ name: "Extra Pork", SKU: "Ex PK", price: 3.50 },
        		{ name: "Extra Shrimp", SKU: "Ex Shrimp", price: 3.50 },
        		{ name: "Extra Tofu", SKU: "Ex Tofu", price: 2.00 },
        		{ name: "Extra Veggie", SKU: "Ex Veg", price: 2.00 },
        		{ name: "Extra Broccoli", SKU: "Ex Broc", price: 2.00 },
        		{ name: "Extra Mushroom", SKU: "Ex Mush", price: 2.00 }
        	]
    	}
    ];
    Modifiers.remove({});
    for (var i = 0; i < modifier.length; i++)
        Modifiers.insert(modifier[i]);




    //setHourlyTotal();
    var now = moment()._d;
    Orders.find({created_at: {$gt: now}}).observe({
        added: function(order){
            //setHourlyTotal();
        }
    });

});

function round2(value){
    var decimals = 2;
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function setHourlyTotal(){
    var today = moment().startOf('day')._d;
    var hourly = Orders.aggregate([
        {$match: { created_at: {$gt: today}}},
        {$group: {_id:"$date.hour", total:{$sum:"$sum.total"}} }
        ]);
    console.log(hourly);
    var total = 0;
    for (var i=0; i<hourly.length; i++){
        total += hourly[i].total;
    }
    total = round2(total);
    var d = moment().format("YYYYMMDD");
    var sale = Sales.findOne({_id:d});
    if (sale) {
        Sales.update({_id:d}, { total: total });
    }
    else {
        Sales.insert({ _id: d, total: total});
    }
    console.log("Total: "+total);
}

