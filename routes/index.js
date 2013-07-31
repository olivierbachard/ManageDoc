
/*
 * GET home page.
 */

exports.index = function(req, res){

	//res.render('index', { title: 'Express', layout: 'layout' });
  	res.render('index', { title: 'Smart Technical Documentation' });
};