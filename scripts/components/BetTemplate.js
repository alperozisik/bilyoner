/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');

const BetTemplateDesign = require('library/BetTemplate');

const BetTemplate = extend(BetTemplateDesign)(
	//constructor
	function(_super, props, pageName){
		// initalizes super class for this scope
		_super(this, props || BetTemplateDesign.defaults );
		this.pageName = pageName;
		
		this.setData = function(type, bet) {
			this.labelType.text = type;
			if (bet && bet.OV) { 
				this.labelPercent.text = bet.OV;
			} else {
				this.labelPercent.text = "";
			}
		}.bind(this);
	}
	
);

module && (module.exports = BetTemplate);

