// equal
Handlebars.registerHelper('eq', function( a, b ){
	var next =  arguments[arguments.length-1];
	return (a === b) ? next.fn(this) : next.inverse(this);
});
// not equal
Handlebars.registerHelper('ne', function( a, b ){
	var next =  arguments[arguments.length-1];
	return (a !== b) ? next.fn(this) : next.inverse(this);
});
// less than
Handlebars.registerHelper('lt', function( a, b ){
	var next =  arguments[arguments.length-1];
	return (a < b) ? next.fn(this) : next.inverse(this);
});
// less than or equal to
Handlebars.registerHelper('le', function( a, b ){
	var next =  arguments[arguments.length-1];
	return (a <= b) ? next.fn(this) : next.inverse(this);
});
// greater than
Handlebars.registerHelper('gt', function( a, b ){
	var next =  arguments[arguments.length-1];
	return (a > b) ? next.fn(this) : next.inverse(this);
});
// greater than or equal to
Handlebars.registerHelper('ge', function( a, b ){
	var next =  arguments[arguments.length-1];
	return (a >= b) ? next.fn(this) : next.inverse(this);
});