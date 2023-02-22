const express = require("express");
const router = express.Router();
const Article = require("../models/article");

router.get("/", async (req, res, next) => {
	let skip = req.query.pageSize || 10;
	let page = req.query.page || 1;

	try {
		const articles = await Article.find()
			.skip(skip * (page - 1))
			.limit(skip);

		const totalArticles = await Article.countDocuments();

		const totalPages = Math.ceil(totalArticles / skip);

		return res.send({ articles, totalPages });
	} catch (error) {
		next(error);
	}
});

router.get("/:slug", async (req, res, next) => {
	try {
		const slug = req.params.slug;
		const articleToGet = await Article.findOne({ slug });
		if (articleToGet) return res.send(articleToGet);
		res.status(404).send("No article found with the given Id");
	} catch (error) {
		next(error);
	}
});

router.post(
	"/",
	async (req, res, next) => {
		const article = new Article();
		req.article = article;
		next();
	},
	saveArticle()
);

router.delete("/:id", async (req, res, next) => {
	try {
		const deletedArticle = await Article.findByIdAndDelete(req.params.id);
		if (deletedArticle) return res.send(deletedArticle);
		res.status(404).send("No Article with this id available");
	} catch (error) {
		next(error);
	}
});

router.put(
	"/:id",
	async (req, res, next) => {
		const article = await Article.findById(req.params.id);
		req.article = article;
		next();
	},
	saveArticle()
);

function saveArticle() {
	return async (req, res, next) => {
		let article = req.article;

		article.title = req.body.title ? req.body.title : article.title;
		article.description = req.body.description
			? req.body.description
			: article.description;
		article.markdown = req.body.markdown ? req.body.markdown : article.markdown;

		try {
			const savedArticle = await req.article.save();
			res.send(savedArticle);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = router;
