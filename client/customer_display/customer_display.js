Template.customer_display.helpers({
	currency: function (number) {
		return "$" + Number(number).toFixed(2);
	}
});
Template.customer_display_item.helpers({
	currency: function (number) {
		return "$" + Number(number).toFixed(2);
	}
});