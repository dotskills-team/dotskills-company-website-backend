import sanitize from 'sanitize-html';

/** Whitelist of what the admin rich text editor can produce. */
export const cleanRichText = (html: string): string =>
  sanitize(html, {
    allowedTags: [
      'p', 'br', 'h1', 'h2', 'h3',
      'strong', 'em', 'u', 's', 'code',
      'ul', 'ol', 'li', 'blockquote', 'hr',
      'a', 'img',
      'div', 'iframe',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt'],
      div: ['data-youtube-video', 'class'],
      iframe: [
        'src',
        'width',
        'height',
        'allowfullscreen',
        'frameborder',
        'allow',
        'title',
        'loading',
        'referrerpolicy',
        'class',
      ],
      '*': ['style'],
    },
    allowedStyles: {
      '*': { 'text-align': [/^(left|center|right)$/] },
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https'], iframe: ['https'] },
    // Only YouTube players may be embedded
    allowedIframeHostnames: ['www.youtube.com', 'www.youtube-nocookie.com'],
    transformTags: {
      a: sanitize.simpleTransform('a', {
        rel: 'noopener noreferrer nofollow',
        target: '_blank',
      }),
    },
  }).trim();