# 🔒 Fix: Secret Detected in Git History

GitHub detected a secret (Hugging Face API token) in your `.env` file that was committed. Here's how to fix it:

## ⚠️ IMPORTANT: First, Revoke Your Exposed Secret

1. **Go to Hugging Face:** https://huggingface.co/settings/tokens
2. **Delete the exposed token** (the one that was in `.env`)
3. **Create a new token** if needed

---

## 🛠️ Step 1: Remove .env from Git History

Run these commands in your project root:

```bash
# Remove .env files from git tracking (but keep local files)
git rm --cached backend/.env
git rm --cached frontend/.env
git rm --cached .env 2>/dev/null || true

# Remove from git history completely (this rewrites history)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env frontend/.env .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push to overwrite remote history
git push origin --force --all
git push origin --force --tags
```

**⚠️ Warning:** This rewrites git history. If others have cloned the repo, they'll need to re-clone.

---

## 🛠️ Alternative: Simpler Method (Recommended)

If you don't have many commits yet, this is easier:

```bash
# 1. Remove .env from tracking
git rm --cached backend/.env 2>/dev/null || true
git rm --cached frontend/.env 2>/dev/null || true
git rm --cached .env 2>/dev/null || true

# 2. Commit the removal
git commit -m "Remove .env files from git (contains secrets)"

# 3. Push (GitHub will allow this if you follow their URL)
# Or use BFG Repo-Cleaner for cleaner history:
```

### Using BFG Repo-Cleaner (Best for cleaning history):

1. **Download BFG:** https://rtyley.github.io/bfg-repo-cleaner/
2. **Run:**
   ```bash
   java -jar bfg.jar --delete-files .env
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push origin --force --all
   ```

---

## ✅ Step 2: Verify .env is Ignored

The `.gitignore` files have been updated. Verify:

```bash
# Check if .env is being tracked
git ls-files | grep .env

# Should return nothing (empty)
```

---

## ✅ Step 3: Commit the .gitignore Updates

```bash
git add .gitignore backend/.gitignore frontend/.gitignore
git commit -m "Update .gitignore to exclude .env files"
git push
```

---

## ✅ Step 4: Follow GitHub's Unblock Link

GitHub gave you this link to unblock the secret:
```
https://github.com/satvik078/ChitraArtist/security/secret-scanning/unblock-secret/34qVRVhQvHezt7osuosBly4POLH
```

**Click it and:**
1. Confirm you've revoked the exposed token
2. Confirm you've removed it from git history
3. GitHub will allow you to push

---

## 🛡️ Prevent This in Future

**Never commit `.env` files!** Always:

1. ✅ Add `.env` to `.gitignore` (already done ✅)
2. ✅ Use `.env.example` for template values
3. ✅ Check before committing: `git status` (should NOT show `.env`)
4. ✅ Use environment variables in deployment platforms (Vercel, Render)

---

## 📝 Quick Fix Commands (Copy-Paste)

If you just want to fix it quickly:

```bash
# Remove from tracking
git rm --cached backend/.env frontend/.env .env 2>/dev/null || true

# Add removal to git
git add .gitignore backend/.gitignore frontend/.gitignore

# Commit
git commit -m "Remove .env files from git and update .gitignore"

# Push (may need to follow GitHub's unblock link first)
git push origin main --force
```

---

## 🔄 If You've Already Pushed

If the secret was already pushed to GitHub:

1. **Revoke the token immediately** (Hugging Face settings)
2. **Remove from git history** (commands above)
3. **Create new token** after cleaning history
4. **Add new token only in deployment platform** (Render, Vercel) - NOT in git!

---

After fixing, your secrets will only exist locally and in deployment platforms, never in git! 🔒

