# 🤝 Contributing to StyleHub

Thank you for your interest in contributing to StyleHub! This document provides guidelines and instructions for hackathon participants.

---

## 📋 Table of Contents

- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [Code Standards](#-code-standards)
- [Commit Guidelines](#-commit-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Challenge Guidelines](#-challenge-guidelines)
- [Testing Requirements](#-testing-requirements)
- [Getting Help](#-getting-help)

---

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR-USERNAME/stylehub.git
cd stylehub
```

### 2. Set Up Upstream

```bash
# Add the original repository as upstream
git remote add upstream https://github.com/ORIGINAL-OWNER/stylehub.git

# Verify remotes
git remote -v
```

### 3. Create a Branch

```bash
# Always create a new branch for your work
git checkout -b feature/your-feature-name

# Branch naming conventions:
# feature/product-detail-page
# feature/shopping-cart
# fix/mobile-menu-bug
# enhancement/improve-animations
```

---

## 🔄 Development Workflow

### Step 1: Choose Your Challenge

1. Review available challenges in [README.md](README.md)
2. Check existing pull requests to avoid duplicates
3. Comment on the issue to claim it (if applicable)

### Step 2: Plan Your Implementation

1. Read the challenge requirements carefully
2. Sketch out your approach
3. Identify files you'll need to modify/create
4. Consider edge cases and error handling

### Step 3: Implement

1. Write clean, readable code
2. Follow existing code style
3. Add comments for complex logic
4. Test frequently as you develop

### Step 4: Test Thoroughly

1. Test on multiple browsers
2. Test on different screen sizes
3. Check for console errors
4. Verify accessibility

### Step 5: Submit

1. Commit your changes
2. Push to your fork
3. Create a pull request
4. Fill out the PR template

---

## 📝 Code Standards

### HTML Guidelines

```html
<!-- ✅ Good: Semantic HTML with proper structure -->
<section class="product-detail">
  <article class="product-info">
    <h1 class="product-title">Product Name</h1>
    <p class="product-description">Description here</p>
  </article>
</section>

<!-- ❌ Bad: Non-semantic divs everywhere -->
<div class="product-detail">
  <div class="product-info">
    <div class="product-title">Product Name</div>
    <div class="product-description">Description here</div>
  </div>
</div>
```

**Best Practices:**
- Use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- Include proper ARIA labels for accessibility
- Use meaningful class names (BEM methodology preferred)
- Ensure proper heading hierarchy (h1 → h2 → h3)
- Add alt text to all images

### CSS Guidelines

```css
/* ✅ Good: Well-organized, using CSS variables */
.product-card {
  background: var(--surface);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
}

/* ❌ Bad: Magic numbers, no variables */
.product-card {
  background: #1e293b;
  border-radius: 12px;
  padding: 32px;
  transition: transform 0.3s ease;
}
```

**Best Practices:**
- Use CSS variables for colors, spacing, and common values
- Follow mobile-first approach (min-width media queries)
- Use Flexbox and Grid for layouts
- Avoid `!important` unless absolutely necessary
- Group related properties together
- Use meaningful class names
- Add comments for complex styles

### JavaScript Guidelines

```javascript
// ✅ Good: Clear, documented, error handling
/**
 * Adds a product to the shopping cart
 * @param {Object} product - The product to add
 * @param {number} quantity - Quantity to add
 * @returns {boolean} Success status
 */
function addToCart(product, quantity = 1) {
  if (!product || !product.id) {
    console.error('Invalid product');
    return false;
  }
  
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  
  saveCart(cart);
  updateCartUI();
  return true;
}

// ❌ Bad: No documentation, no error handling
function addToCart(product, quantity) {
  let cart = JSON.parse(localStorage.getItem('cart'));
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
}
```

**Best Practices:**
- Use `const` and `let`, avoid `var`
- Write descriptive function and variable names
- Add JSDoc comments for functions
- Handle errors gracefully
- Use modern ES6+ features (arrow functions, destructuring, etc.)
- Avoid global variables
- Use event delegation for dynamic elements
- Debounce/throttle expensive operations

---

## 💬 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Good commit messages
git commit -m "feat(cart): add shopping cart functionality"
git commit -m "fix(mobile): resolve menu toggle issue on iOS"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(css): improve button hover animations"

# Bad commit messages
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "wip"
```

### Commit Best Practices

- Write clear, descriptive messages
- Keep commits focused (one logical change per commit)
- Commit frequently with working code
- Don't commit commented-out code
- Don't commit console.log statements (unless intentional)

---

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No console errors
- [ ] Responsive design works
- [ ] Accessibility checked
- [ ] Documentation updated
- [ ] Commits are clean and descriptive

### PR Template

Use this template when creating your pull request:

```markdown
## Challenge Completed
[Challenge Name]

## Description
Provide a clear description of what you implemented and how it works.

## Changes Made
- List the main changes
- Include new files created
- Mention modified files

## Screenshots
Add screenshots showing your feature in action:
- Desktop view
- Mobile view
- Different states (hover, active, etc.)

## Testing Checklist
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari
- [ ] Tested on Edge
- [ ] Tested on mobile devices (iOS/Android)
- [ ] No console errors
- [ ] Responsive design works (320px - 1920px)
- [ ] Accessibility tested (keyboard navigation, screen readers)
- [ ] Form validation works (if applicable)
- [ ] Data persistence works (if applicable)

## Implementation Details
Explain any interesting technical decisions or challenges you faced.

## Additional Features
List any bonus features or improvements beyond the challenge requirements.

## Known Issues
List any known limitations or issues (if any).

## Related Issues
Closes #[issue number]

## Questions for Reviewers
Any specific areas you'd like feedback on?
```

### Review Process

1. **Automated Checks** - Your PR will be automatically checked for:
   - Code style violations
   - Broken links
   - Console errors

2. **Peer Review** - Other participants may review your code

3. **Mentor Review** - A mentor will provide feedback

4. **Revisions** - Address any requested changes

5. **Merge** - Once approved, your PR will be merged!

---

## 🎯 Challenge Guidelines

### Choosing a Challenge

1. **Start with your skill level**
   - Beginner: Challenges 1, 8
   - Intermediate: Challenges 2, 3, 5
   - Advanced: Challenges 4, 6, 7

2. **Consider time available**
   - 1-2 hours: Challenge 8
   - 2-3 hours: Challenges 1, 5
   - 3-4 hours: Challenges 2, 3
   - 4-5 hours: Challenges 4, 6
   - 5-6 hours: Challenge 7

3. **Check dependencies**
   - Some challenges build on others
   - Cart functionality needed before checkout
   - Product pages needed before reviews

### Implementation Requirements

#### Minimum Requirements
- Feature works as described
- No breaking changes to existing code
- Responsive design maintained
- No console errors
- Basic error handling

#### Bonus Points
- Exceptional UI/UX
- Additional features
- Accessibility enhancements
- Performance optimizations
- Comprehensive documentation
- Unit tests

### File Organization

```
# When adding new features, organize files logically:

# New HTML pages
/pages/
  product-detail.html
  cart.html
  checkout.html

# New CSS files
/css/
  product-detail.css
  cart.css
  checkout.css

# New JavaScript modules
/js/
  cart.js
  products.js
  checkout.js
  utils.js

# New images
/images/
  products/
  icons/
```

---

## 🧪 Testing Requirements

### Browser Testing

Test on these browsers (minimum):
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Responsive Testing

Test at these breakpoints:
- Mobile: 320px, 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1440px, 1920px

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color contrast sufficient
- [ ] Screen reader compatible
- [ ] No keyboard traps

### Performance Testing

- [ ] Page loads in < 3 seconds
- [ ] No layout shifts
- [ ] Images optimized
- [ ] No memory leaks
- [ ] Smooth animations (60fps)

---

## 🐛 Bug Reports

Found a bug? Here's how to report it:

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
Add screenshots if applicable

## Environment
- Browser: [e.g., Chrome 90]
- OS: [e.g., macOS 11.2]
- Screen size: [e.g., 1920x1080]

## Additional Context
Any other relevant information
```

---

## 💡 Getting Help

### Resources

1. **Documentation**
   - [README.md](README.md) - Project overview
   - [STYLEHUB_PLAN.md](STYLEHUB_PLAN.md) - Detailed plan
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture diagrams

2. **Communication Channels**
   - Slack: #stylehub-hackathon
   - Email: support@stylehub.dev
   - GitHub Issues: For bugs and questions

3. **Office Hours**
   - Monday-Friday: 2pm-4pm EST
   - Saturday: 10am-12pm EST

### Common Issues

#### Issue: Git conflicts
```bash
# Update your branch with latest changes
git fetch upstream
git rebase upstream/main

# Resolve conflicts in your editor
# Then continue rebase
git add .
git rebase --continue
```

#### Issue: Can't see changes
```bash
# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# If using a local server, restart it
```

#### Issue: CSS not applying
- Check for typos in class names
- Verify CSS file is linked in HTML
- Check browser DevTools for specificity issues
- Clear browser cache

---

## 🎓 Learning Resources

### Recommended Reading
- [MDN Web Docs](https://developer.mozilla.org)
- [CSS-Tricks](https://css-tricks.com)
- [JavaScript.info](https://javascript.info)
- [Web.dev](https://web.dev)

### Video Tutorials
- [freeCodeCamp](https://www.freecodecamp.org)
- [Traversy Media](https://www.youtube.com/user/TechGuyWeb)
- [Web Dev Simplified](https://www.youtube.com/c/WebDevSimplified)

### Practice Platforms
- [Frontend Mentor](https://www.frontendmentor.io)
- [CodePen](https://codepen.io)
- [JSFiddle](https://jsfiddle.net)

---

## 🏆 Recognition

Outstanding contributions will be recognized:

- 🥇 **Top Contributor** - Most impactful contribution
- 🎨 **Best Design** - Most visually appealing implementation
- 💻 **Best Code Quality** - Cleanest, most maintainable code
- 🚀 **Most Innovative** - Most creative solution
- 🤝 **Community Champion** - Most helpful to other participants

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all participants.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers
- Provide constructive feedback
- Focus on learning and growth
- Help others when possible

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Plagiarism
- Sharing solutions without attribution

### Reporting

Report any issues to: conduct@stylehub.dev

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You!

Thank you for contributing to StyleHub! Your participation helps create a better learning experience for everyone.

**Happy Coding! 🚀**

---

*Last updated: 2026-05-28*