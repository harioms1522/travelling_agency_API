// Implementing the all the get API features of in a class for getting the processed filtered sorted and projected paginated documents
class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr; //actually this is an object
  }

  // Filtering
  filter() {
    const queryStrObj = { ...this.queryStr };

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((curr) => {
      delete queryStrObj[curr];
    });

    // Advanced filtering
    let queryString = JSON.stringify(queryStrObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    // giving filtered object of documents
    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  // Sorting
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  // projection
  limitFields() {
    if (this.queryStr.fields) {
      const projectBy = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(projectBy);
    }
    return this;
  }

  // Pagination
  paginate() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 25;
    const skip = (page - 1) * limit;

    // if (this.query.page) {
    //   const numDocs = await Tour.countDocuments();
    //   if (skip > numDocs) throw new Error("This page doesn't exist!");
    // }

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
