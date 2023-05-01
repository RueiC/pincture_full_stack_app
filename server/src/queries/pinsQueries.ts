export const pinsQuery: string = `*[_type == "pin"] | order(_createdAt desc) {
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
  } `;

export const pinQuery = (pinId: string): string => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
    image{
      asset->{
        url
      }
    },
    _id,
    userId,
    title, 
    about,
    category,
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

export const pinCommentsQuery = (pinId: string): string => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
    comments[]{
      _key,
      comment,
      createdAt,
      postedBy->{
        _id,
        name,
        image
      },
    },
  }`;
  return query;
};

export const savePinQuery = (pinId: string): string => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
   save[]{
      _key,
      userId
    },
  }`;
  return query;
};
