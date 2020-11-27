const mongoose = require("mongoose");
const cacheManager = require("../utils/cache-manager");

const searchedLayouts = { post: 'relatedPosts', category: 'relatedCategories' };

const BlockSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	tenant: {
		type: String,
		required: true,
	},
	description: { //editors only in controller!
		type: String,
	},
	contents: [],
	contentType: {
		type: String,
		enum: [
			"content", // for regular blocks
			"images", // for a gallery of images
			"script", // for ads
		],
	},
	relatedCategories: [ {
		type: mongoose.Schema.Types.ObjectID,
		ref: 'category'
	} ],
	relatedPosts: [ {
		type: mongoose.Schema.Types.ObjectID,
		ref: 'post'
	} ],
	relatedLayouts: [ {
		type: String,
		enum: [ 'layout', 'index', 'category', 'post', 'search', 'tag', 'error' ]
	} ],
});

BlockSchema.statics.search = function search(relatedLayout, itemId) {
	const query = {
		relatedLayouts: relatedLayout
	};
	if (searchedLayouts[relatedLayout]) {
		query[searchedLayouts[relatedLayout]] = itemId;
	}
	return this.find(query).lean().select('-description -tenant');
};

BlockSchema.statics.getLayoutBlocks = function getLayoutBlocks() {
	return this
		.find({
			relatedLayouts: 'layout'
		})
		.lean()
		.select('-description -tenant');
};

module.exports = mongoose.model('Block', BlockSchema);
