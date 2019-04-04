const axios = require("axios"),
      sequelize = require("sequelize");

const {CANON_LOGICLAYER_CUBE} = process.env;

const slugMap = {
  cip: "CIP",
  geo: "Geography",
  naics: "PUMS Industry",
  napcs: "NAPCS",
  soc: "PUMS Occupation",
  university: "University"
};

module.exports = function(app) {

  const {db} = app.settings;
  const {parents} = app.settings.cache;

  app.get("/api/profile/:pslug/:pid/:size", (req, res) => {
    const {size, pid, pslug} = req.params;

    /** Sends the finally found image, and includes fallbacks */
    function sendImage(image) {

      const id = image ? image : pslug === "university" ? "2032" : "1849";
      if (size === "json") db.images.findOne({where: {id}}).then(resp => res.json(resp));
      else {
        res.sendFile(`${process.cwd()}/static/images/profile/${size}/${id}.jpg`, err => {
          if (err) res.status(err.status);
          res.end();
        });
      }

    }

    db.search.findOne({where: {[sequelize.Op.or]: {id: pid, slug: pid}, dimension: slugMap[pslug]}})
      .then(attr => {

        if (!attr) sendImage(false);
        else {

          const {id, imageId} = attr;

          if (!imageId) {

            if (parents[pslug]) {

              const ids = parents[pslug][id];

              if (ids.length) {

                db.search.findAll({where: {id: ids, dimension: slugMap[pslug]}})
                  .then(parentAttrs => {
                    const parentImage = parentAttrs
                      .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
                      .find(p => p.imageId);
                    sendImage(parentImage ? parentImage.imageId : false);
                  })
                  .catch(err => {
                    console.error(`[api/profileImage] parent cache error for ${pslug}/${pid}: (${err.status ? `${err.status} - ` : ""}${err.message})}`);
                    sendImage(false);
                  });

              }
              else {
                sendImage(false);
              }

            }
            else if (pslug === "geo") {

              axios.get(`${CANON_LOGICLAYER_CUBE}geoservice-api/relations/parents/${attr.id}`)
                .then(d => d.data.reverse())
                .then(d => d.map(p => p.geoid))
                .then(d => {
                  const attrs = db.search.findAll({where: {id: d, dimension: slugMap[pslug]}}).catch(() => []);
                  return Promise.all([d, attrs]);
                })
                .then(([ids, parentAttrs]) => {
                  const parentImage = parentAttrs
                    .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
                    .find(p => p.imageId).imageId;
                  sendImage(parentImage);
                })
                .catch(err => {
                  console.error(`[api/profileImage] geoservice error for ${pslug}/${pid}: (${err.status ? `${err.status} - ` : ""}${err.message})}`);
                  sendImage(false);
                });

            }
            else sendImage(false);

          }
          else sendImage(imageId);

        }

      })
      .catch(err => {
        console.error(`[api/profileImage] search matching for ${pslug}/${pid}: (${err.status ? `${err.status} - ` : ""}${err.message})}`);
        sendImage(false);
      });

  });

};
