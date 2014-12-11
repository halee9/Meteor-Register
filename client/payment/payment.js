Session.set("payable_total", 0);
Session.set("payable_subtotal", 0);
Session.set("payable_tax", 0);
Session.set("credit", 0);
Session.set("cash", 0);
Session.set("change", 0);

Template.pay_item.events({
	'click': function (theEvent, theTemplate) {
		if (theTemplate.data.pay_status == PAY_STATUS_TYPE[2]) return;
		var item = theTemplate.find(".item");
		if ($(item).hasClass('selected')) {
			$(item).removeClass('selected');
			Meteor.call('setPayStatus', theTemplate.data._id, PAY_STATUS_TYPE[0]);
		}
		else {
			$(item).addClass('selected');
			Meteor.call('setPayStatus', theTemplate.data._id, PAY_STATUS_TYPE[1]);
		}
	}
});

Template.pay_action.events({
	'click button.submit': function (theEvent, theTemplate) {
		var order_id = Session.get("payment_order_id");
		var payable = {};
		payable.total = Session.get("payable_total");
		payable.subtotal = Session.get("payable_subtotal");
		payable.tax = Session.get("payable_tax");
		var that = this;
		Meteor.call('addPayment', order_id, this.credit, this.cash, this.change, payable, function (error, response) {
			console.log(response);
			if (response.unpaid_item == false) {
				if (response.order_type != ORDER_TYPE[0])
					Router.go("/ticket/"+response.order_id);
				else
					Router.go("/register");
			}
		});
	},
	'click button.backToOrder': function () {
		var order_id = Session.get("payment_order_id");
		Router.go("/register/"+order_id);
	},
	'click button.cash_picker': function(theEvent, theTemplate){
		var payable = Session.get("payable_total");
		var cash = Number(this);
		var credit = 0;

		Session.set("cash", cash);
		Session.set("credit", credit);
		Session.set("change", cash - payable);
	},
	'click button.credit_apply': function(theEvent, theTemplate){
		var credit_obj = theTemplate.find(".credit");
		var credit = Number($(credit_obj).val());
		if (credit == 0) {
			Session.set("credit", Session.get("payable_total"));
			Session.set("cash", 0);
			Session.set("change", 0);
		}
		else {
			var cash = Session.get("cash");
			var payable = Session.get("payable_total");
			if (credit > payable) {
				credit = payable;
			}
			cash = payable - credit;
			Session.set("credit", credit);
			Session.set("cash", cash);
			Session.set("change", 0);
		}
	},
	'click button.cash_apply': function(theEvent, theTemplate){
		var cash_obj = theTemplate.find(".cash");
		var cash = Number($(cash_obj).val());
		Session.set("cash", cash);
		var credit = Session.get("credit");
		var payable = Session.get("payable_total");
		if (cash >= payable) {
			credit = 0;
			change = cash - payable;
		}
		else {
			credit = payable - cash;
			change = 0;
		}
		//console.log(this);
		Session.set("credit", credit);
		Session.set("change", change);
	}
});

Template.ordersToPay.helpers({
    last_two: function(number) {
        return (number % 100);
    }
});

Template.pay_total.helpers({
	currency: function(num){
		return Number(num).toFixed(2);
	}
});

Template.pay_info.helpers({
	amount: function(){
		//console.log(this._id);
		var payment = Payments.findOne({_order: this._id});
		if (payment) {
			var difference = this.sum.subtotal - payment.sum.subtotal;
		}
		else var difference = 0;
		var items = this.items;
		if (items) {
			var amount = {};
			var payable = 0;
			var unpaid = 0;
			var paid = 0;
			for (var i=0; i<items.length; i++){
				if (items[i].pay_status === PAY_STATUS_TYPE[0])
					//* UnSelected - unpaid amount
					unpaid += items[i].subtotal;
				else if (items[i].pay_status === PAY_STATUS_TYPE[1])
					//* Selected - payable amount
					payable += items[i].subtotal;
				else //* Paid amount
					paid += items[i].subtotal;

			}
			payable = payable + difference;

			amount.payable = MIDORI.getTotal(payable);
			amount.unpaid = MIDORI.getTotal(unpaid).total;
			amount.paid = MIDORI.getTotal(paid).total;

			Session.set("payable_total", amount.payable.total);
			Session.set("payable_subtotal", amount.payable.subtotal);
			Session.set("payable_tax", amount.payable.tax);
			Session.set("credit", amount.payable.total);
			Session.set("cash", 0);
			
			console.log(amount);
			return amount;
		}
	},
	currency: function(num){
		return Number(num).toFixed(2);
	},
    last_two: function(number) {
        return (number % 100);
    }

});

Template.pay_item.helpers({
	selected: function(){
		if (this.pay_status == PAY_STATUS_TYPE[0]) return '';
		else return 'selected';
	},
	paid: function(){
		if (this.pay_status == PAY_STATUS_TYPE[2]) return 'paid';
		else return '';
	},
	currency: function(num){
		return Number(num).toFixed(2);
	}
});

Template.pay_action.helpers({
	pay: function(){
		var pay = {};
		pay.payable = Session.get("payable_total");
		pay.credit = Session.get("credit");
		pay.cash = Session.get("cash");
		pay.change = Session.get("change");
		pay.cash_pickers = getCashExamples(pay.payable);
		//console.log(pay);
		return pay;
	},
	currency: function(num){
		return Number(num).toFixed(2);
	},
    last_two: function(number) {
        return (number % 100);
    }
});


function uniqueArray(arr){
	var uniqueArr = [];
	$.each(arr, function(i, el){
		if($.inArray(el, uniqueArr) === -1) uniqueArr.push(el);
	});
	return uniqueArr;
}

function getCashBills(amount) {
	var bills = [0.01, 005, 0.1, 0.25, 1, 5, 10, 20, 50, 100];
	var base = Math.ceil(amount);
	var result = [];
	result.push(amount);
	result.push(base);
	for (var i=0; i<bills.length; i++){
		result.push(bills[i] * Math.ceil(base/bills[i]));
	}
	return uniqueArray(result);
}

function getCashExamples(amount) {
	var bills = [0.05, 0.1, 0.25, 1, 5, 10, 20, 50, 100];
	var result = [];
	result.push(amount);
	for (var i=0; i<bills.length; i++){
		if (bills[i] < 1) {
			var base = Math.ceil(amount * 100);
			var bill = bills[i] * 100;
			result.push((bill * Math.ceil(base/bill))/100);
		}
		else {
			var base = Math.ceil(amount);
			result.push(bills[i] * Math.ceil(base/bills[i]));
		}
	}
	//console.log(result);
	return uniqueArray(result);
}



