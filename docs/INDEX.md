# Documentation Index

**For Claude Code: Three access patterns for maximum efficiency**

## 🎯 Choose Your Access Method

### 1. Task-Based Access → [TASKS.md](./TASKS.md)
**Use when**: User describes what they want to do  
**Example**: "write blog post" → direct file mapping  
**Token cost**: ~200 words for complete task coverage

### 2. Keyword-Based Access → [KEYWORDS.md](./KEYWORDS.md)
**Use when**: User mentions specific terms  
**Example**: "image" → `writing/images.md`  
**Token cost**: ~195 words for semantic mapping

### 3. Category Access → Category INDEX files
**Use when**: User specifies category
- `writing/INDEX.md` - Content creation (105 words)
- `development/INDEX.md` - Feature development (125 words)

## 🚀 Efficiency Rules

1. **Start with TASKS.md** for user intent mapping (covers 95% of requests)
2. **Use KEYWORDS.md** for semantic search optimization  
3. **Direct file access** when exact file is known
4. **Category indexes** for workflow-based tasks

## 📈 Token Savings

- **Before**: Reading 3-5 files (600-1,500 words) to find information
- **After**: Single file access (100-315 words) with precise targeting
- **Efficiency gain**: 70-80% token reduction for most tasks

**Total docs**: 35 files, ~6,000 words optimized for Claude Code