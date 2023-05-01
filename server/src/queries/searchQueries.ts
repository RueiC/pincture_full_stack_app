export const searchQuery = (searchTerm: string): string => {
  const query = `*[_type == "pin" && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']{
        image{
          asset->{
            url
          }
        },
            _id,
            userId,
            destination,
            postedBy->{
              _id,
              name,
              image
            },
            save[]{
              _key,
              userId
            },
          }`;
  return query;
};

export const categoryQuery = (categoryId: string): string => {
  const query = `*[_type == "pin" && category == '${categoryId}']{
  image{
    asset->{
      url
    }
  },
  _id,
  userId,
  destination,
  postedBy->{
    _id,
    name,
    image
  },
  save[]{
    _key,
    userId
  },
}`;
  return query;
};
