export function updateMetaTags({ title, description, keywords }) {
  // Update title
  if (title) {
    document.title = `${title} | Academia Online`;
  }

  // Update or create meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  if (description) {
    metaDescription.setAttribute('content', description);
  }

  // Update or create meta keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    document.head.appendChild(metaKeywords);
  }
  if (keywords) {
    metaKeywords.setAttribute('content', keywords);
  }
}