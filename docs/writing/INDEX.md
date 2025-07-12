# Writing Quick Index

**For Claude Code: Direct file access for content creation**

## Instant Access by Task

| Need | File | Words |
|------|------|-------|
| **New post** | `blog-post-template.md` | 227 |
| **Frontmatter setup** | `frontmatter.md` | 177 |
| **Add images** | `images.md` | 152 |
| **Warning/note boxes** | `admonitions.md` | 216 |
| **Step instructions** | `steppers.md` | 173 |
| **Draft posts** | `drafts.md` | 115 |
| **Markdown syntax** | `markdown-basics.md` | 171 |
| **Common patterns** | `quick-reference.md` | 170 |

## Quick Commands

```bash
# Create new post
touch src/content/blog/my-post.mdx
mkdir public/images/blog/my-post/

# Check draft status  
grep "draft:" src/content/blog/*.mdx
```

Total: 8 files, ~1,401 words