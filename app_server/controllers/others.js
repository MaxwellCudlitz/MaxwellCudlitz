module.exports.about = function(req, res){
	res.render('generic-text', { 
		title: 'About Loc8r',
		content: 'Loc8r was created to help people find places to sit down and get a bit of work done \n\n consectetur adipiscing elit. Nulla vitae nunc sed leo commodo vehicula. Donec nunc turpis, semper sit amet ex faucibus, tempor iaculis mi. Sed eu tellus ut felis hendrerit porttitor. Suspendisse felis sapien, pharetra non nulla ut, pellentesque interdum mi. Vivamus non iaculis mauris. Duis rutrum arcu erat, eget vehicula magna ultrices luctus. Proin venenatis mi id neque placerat efficitur ac eu ex.' 
	});
};

module.exports.angularApp = function(req, res){
	res.render('layout', { title: 'Loc8r' });
};