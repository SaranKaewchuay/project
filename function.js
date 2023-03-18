const axios = require("axios");
const cheerio = require("cheerio");
const { removeSpace,change } = require("./format");
const { check_field } = require("./check");
const iconv = require('iconv-lite');
var numArticle = null;
const articleAll = [];

const getAllAuthorURL = async (selector, url) => {
  const html = await sendRequestGetDetail(url);
  const allURL = await getURL(html, selector);
  return allURL;
};


const getArticleAll = async () => {
  return articleAll;
};


const getURL = async (html, selector) => {
  const $ = cheerio.load(html);
  const content = $(selector);
  const news_data = [];

  content.each(function () {
    const obj = {
      name: $(this).find("> div > div > h3 > a").text(),
      url: "https://scholar.google.com" + $(this).find("> div > a").attr("href"),
    };
    news_data.push(obj);
  });
  return news_data;
};


const getAuthorDetail = async (html,num) => {
  const $ = cheerio.load(html);
  const subjectArea = [];
  const subject = $("#gsc_prf_int > a");
  console.log("Number of subjectArea : ",subject.length)
  for (let i = 0; i < subject.length; i++) {
    const obj = $("#gsc_prf_int > a:nth-child("+(i+1)+")").text();
    subjectArea.push(obj);
  }
  news_data = {
    author_id : num,
    authorName: $("#gsc_prf_in").text(),
    department: $("#gsc_prf_i > div:nth-child(2)").text(),
    subjectArea : subjectArea,
    h_index :  $("#gsc_rsb_st > tbody > tr:nth-child(2) > td:nth-child(2)").text(),
    image : $("#gsc_prf_pup-img").attr("src"),
  };
  return news_data;
}


const getArticleOfAuthor = async (selector, URL,author_id) => {
  const html = await sendRequestGetDetail(URL);
  const content = await getArrayObjectData(html, selector);
  const new_data = [];

  console.log("Number of Articles : ", content.length);
  console.log("Article");

  //content.length
  for (let i = 0; i < 3; i++) {

    console.log(i + 1);
    const e = content[i];
    const detail_page_url = e.url;
    await new Promise((resolve) => setTimeout(resolve, 100));
    const detail_page_html = await sendRequestGetDetail(detail_page_url);
    numArticle += 1
    const data = await getDetail(detail_page_html,detail_page_url,author_id);
    articleAll.push(data)
    new_data.push(data);

  }
   const all = await getAuthorDetail(html,author_id);
   all.article = new_data
   const author = await getAuthorDetail(html,author_id);
  return {all:all , author:author}

};

const getArrayObjectData = async (html, selector) => {
  const $ = cheerio.load(html);
  const content = $(selector);
  const news_data = [];
  content.each(function () {
    const obj = {
      title: $(this).find("td.gsc_a_t > a").text(),
      url: "https://scholar.google.com" + $(this).find("a").attr("href"),
    };
    news_data.push(obj);
  });
  return news_data;
};


const getDetail = async (html,url,author_id) => {
  const $ = cheerio.load(html);
  const data = check_field($)
  const news_data = {
    article_id : numArticle,
    articleName: $("#gsc_oci_title > a").text(),
    author: $("#gsc_oci_table > div:nth-child(1) > div.gsc_oci_value").text(),
    releaseDate: $("#gsc_oci_table > div:nth-child(2) > div.gsc_oci_value").text(),
    academicJournal: $("#gsc_oci_table > div:nth-child(3) > div.gsc_oci_value").text(),
    volume: data.volume,
    no: data.no,
    page: data.page,
    publisher: data.publisher,
    description: ($("#gsc_oci_descr > div").text().trim()),
    url : url,
    author_id : author_id
  };
  
  return news_data;
};


const sendRequestGetDetail = async (URL) => {
  // const response = await axios.get({URL});
  const response = await axios.request({
    method: 'GET',
    url: URL,
    responseType: 'arraybuffer',
    responseEncoding: 'binary'
  });
  const html = iconv.decode(response.data, 'utf-8');
  return html;
};


module.exports = {
  getArticleOfAuthor,
  getAllAuthorURL,
  sendRequestGetDetail,
  getAuthorDetail,
  getDetail,
  getArticleAll
};


