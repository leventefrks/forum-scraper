const axios = require('axios');
const cheerio = require('cheerio');

(function ({ numberOfPosts }) {
  const baseUrl = `https://forum.index.hu/Article/showArticle?na_start=0&na_step=${numberOfPosts}&t=9125492&na_order=`;

  const response = axios(baseUrl, {
    responseType: 'arraybuffer',
    responseEncoding: 'binary',
  })
    .then(resp => {
      const data = resp.data.toString('binary');
      const $ = cheerio.load(data);
      const comments = [];
      const comment = $('table.art');

      comment.each(function () {
        const nickname = $(this).find('tbody .art_h strong').text();
        const date = $(this)
          .find('tbody .art_h_l span')
          .children()
          .last()
          .text();
        const comment = $(this).find('tbody .art_b .art_t').html();

        comments.push({
          nickname,
          date,
          comment,
        });
      });

      console.log(comments);
    })
    .catch(console.error);
})({ numberOfPosts: 50 });
