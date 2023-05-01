export const userQuery = (email: string): string => {
  const query = `*[_type == "user" && email == '${email}']`;
  return query;
};

export const userIdQuery = (userId: string): string => {
  const query = `*[_type == "user" && _id == '${userId}']{
    _id,
    name,
    _updatedAt,
    image,
    _createdAt,
    type,
    email,
  }`;
  return query;
};

export const userPostedPins = (userId: string): string => {
  const query = `*[ _type == 'pin' && userId == '${userId}'] | order(_createdAt desc){
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

export const userSavedPins = (userId: string): string => {
  const query = `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) {
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
