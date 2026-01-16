import groq from "groq";

export const qListByType = groq`*[_type==$type] | order(_createdAt desc) {
  _id, _createdAt, title, excerpt, "slug": slug.current
}[0...50]`;

export const qDetailByTypeAndSlug = groq`*[_type==$type && slug.current==$slug][0]{
  _id, _createdAt, title, excerpt, body
}`;