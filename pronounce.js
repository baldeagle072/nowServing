var pronunciationDict = {
	"Jesus":"hey soos",
	"Haley":"heylee",
	"Citlaly":"sit lolli",
	"Cristian":"chrischin",
	"Luis D":"looeess d",
	"Noe":"noay",
	"Josafat":"hoesafat",
	"Cesar":"say sar",
	"Jorge":"George",
	"Luis Z":"looeess z",
	"Jaeden":"jayden",
	"Pedro":"paydro",
	"Alondra":"aloandra",
	"Dariana":"dari onnna",
	"Elian":"elly onn"
}

module.exports.correctly = function(inputName) {
	console.log(pronunciationDict[inputName]);
	if (pronunciationDict[inputName]) {
		return pronunciationDict[inputName];
	} else {
		return inputName;
	}
}