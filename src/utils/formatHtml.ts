export const formatHTML = (html: string) => {
  if (!html) return '';
  let formatted = '';
  let pad = 0;
  
  // Split tags that are directly next to each other
  const splitHtml = html.replace(/(>)(<)(\/*)/g, '$1\n$2$3');
  
  splitHtml.split('\n').forEach((line) => {
    line = line.trim();
    if (!line) return;
    
    let indent = 0;
    // If it's a closing tag, decrease padding before adding the line
    if (line.match(/^<\/[a-zA-Z0-9]+>/)) {
      pad = Math.max(0, pad - 1);
    } 
    // If it's an opening tag, not self-closing, and doesn't contain a closing tag on the same line
    else if (line.match(/^<[a-zA-Z0-9]+[^>]*>$/) && 
             !line.match(/^<(img|br|hr|input|meta|link|source)[^>]*>$/i) && 
             !line.match(/<\/[a-zA-Z0-9]+>$/)) {
      indent = 1;
    }
    
    formatted += '  '.repeat(pad) + line + '\n';
    pad += indent;
  });
  
  return formatted.trim();
};

export const cleanHtmlImages = (html: string): string => {
  if (!html) return '';
  return html.replace(/<img\b([^>]*?)>/gi, (match, attrs) => {
    const dataSrcMatch = attrs.match(/data-src=["']([^"']+)["']/i) || 
                         attrs.match(/data-lazy-src=["']([^"']+)["']/i) || 
                         attrs.match(/data-original=["']([^"']+)["']/i);
    if (dataSrcMatch && dataSrcMatch[1]) {
      const realUrl = dataSrcMatch[1];
      let newAttrs = attrs;
      if (/src=["'][^"']*data:image\/svg[^"']*["']/i.test(newAttrs)) {
        newAttrs = newAttrs.replace(/src=["'][^"']*data:image\/svg[^"']*["']/i, `src="${realUrl}"`);
      } else if (!/src=/i.test(newAttrs)) {
        newAttrs = `src="${realUrl}" ` + newAttrs;
      }
      return '<img ' + newAttrs.trim() + '>';
    }
    return match;
  });
};
