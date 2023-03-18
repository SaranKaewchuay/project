const express = require("express");
const { getArticleOfAuthor,getAllAuthorURL,sendRequestGetDetail,getAuthorDetail,getDetail,getArticleAll} = require("./function");



const app = express();
const PORT = process.env.PORT || 8080;

var Ariticle = []
var Author = []
var All = []

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to WEB SCRAPING");
});


app.get("/article", (req, res) => {
  res.status(200).json({
    Ariticle : Ariticle
  });
});

app.get("/author", (req, res) => {
  res.status(200).json({
    Author : Author 
  });
});

app.get("/all", (req, res) => {
  res.status(200).json({
    All : All
  });
});


app.get("/scraper", async (req, res) => {
  const startURL = "https://scholar.google.com/citations?view_op=view_org&org=16635630670053173100&hl=th&oi=io";
  const selectorForURL = "#gsc_sa_ccl > div.gsc_1usr";
  const authorURL = await getAllAuthorURL(selectorForURL, startURL);
  
  const selector = "#gsc_a_b > tr";
  const dataAriticle = [];
  const all = [];
  //authorURL.length
  for (let i = 0; i < authorURL.length; i++) {
    // dataAriticle.id = i+1
    console.log("Author ",i+1," : "+ authorURL[i].name)
    const num = i+1;
    const data = await getArticleOfAuthor(selector, authorURL[i].url, num);
    dataAriticle.push(data.authorDetail);
    all.push(data.all)
  }
  console.log("Finish")
  // const articleAll = await getArticleAll()
  Ariticle = await getArticleAll()
  Author = dataAriticle
  All  = all
  res.status(200).json({
    // url: authorURL,
    // Author: dataAriticle,
    // Ariticle: Ariticle
    data : all
  });
});

app.get("/test", async (req, res) => {

  const selector = "#gsc_a_b > tr";
  const dataAriticle = [];
  //authorURL.length
  console.log("Author 1 : Thimaporn Phetkaew")
  // const url = "https://scholar.google.com/citations?hl=th&user=5OhyuzYAAAAJ";
  const url = "https://scholar.google.com/citations?hl=th&user=YiPGPisAAAAJ";
  const num = 1
  const data = await getArticleOfAuthor(selector, url, num);
  dataAriticle.push(data);

  console.log("Finish")

  res.status(200).json({
    contents: dataAriticle,
  });
});

app.listen(PORT, () => {
  console.log(PORT);
});

