const lunr = require("lunr");

module.exports = async function(app) {

  const {db} = app.settings;

  const rows = await db.search.findAll({include: [{model: db.images}]})
    .catch(() => []);

  let meta = await db.profile_meta.findAll();
  meta = meta.map(m => m.toJSON());
  const slugs = {};
  meta.forEach(m => {
    if (!slugs[m.dimension]) slugs[m.dimension] = m.slug;
  });

  const results = rows
    .map(d => ({
      dimension: d.dimension,
      hierarchy: d.hierarchy,
      id: d.id,
      image: d.image,
      key: `${d.dimension}-${d.hierarchy}-${d.id}`,
      keywords: d.keywords,
      name: d.display,
      profile: slugs[d.dimension],
      slug: d.slug,
      stem: d.stem === 1,
      zvalue: d.zvalue
    }));

  const totals = results.reduce((obj, d) => {
    if (!obj[d.dimension]) obj[d.dimension] = {};
    if (!obj[d.dimension][d.hierarchy]) obj[d.dimension][d.hierarchy] = 0;
    obj[d.dimension][d.hierarchy]++;
    return obj;
  }, {});

  return {
    rows: results.reduce((obj, d) => (obj[d.key] = d, obj), {}),
    totals,
    index: lunr(function() {

      this.ref("key");
      this.field("name", {boost: 3});
      this.field("keywords", {boost: 2});
      this.field("dimension");
      this.field("hierarchy");

      this.pipeline.reset();
      this.searchPipeline.reset();

      results.forEach(result => this.add(result, {boost: result.zvalue}));

    })
  };

};
