// 🛠️ Node.js & MERN Roadmap Dashboard JS Interactions

// 1. Sidebar Section Navigation
function switchSection(sectionId, element) {
  // Remove active classes from navigation links
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => link.classList.remove('active'));

  // Add active class to the clicked link
  element.classList.add('active');

  // Hide all sections/tab-panes
  const panes = document.querySelectorAll('.tab-pane');
  panes.forEach(pane => pane.classList.remove('active'));

  // Show target section
  const targetPane = document.getElementById(sectionId);
  if (targetPane) {
    targetPane.classList.add('active');
  }

  // Update header text based on section name
  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');
  
  const sectionHeaders = {
    'section-overview': {
      title: 'Roadmap Overview',
      subtitle: 'Your comprehensive path from Node.js runtime mechanics to a production MERN Stack application.'
    },
    'section-roadmap': {
      title: '30-60 Day Structured Plan',
      subtitle: 'A day-by-day learning layout designed to build backend mastery step by step.'
    },
    'section-architecture': {
      title: 'MERN Project Blueprint',
      subtitle: 'Production-ready folder patterns and structural design rules for robust full-stack systems.'
    },
    'section-apis': {
      title: 'Database & REST API Spec',
      subtitle: 'MongoDB mongoose schemas and structured API routes for CRUD and secure JWT sessions.'
    },
    'section-challenges': {
      title: 'Daily Coding Prep & QA',
      subtitle: 'Hands-on project challenges and standard MERN stack interview questions.'
    }
  };

  if (sectionHeaders[sectionId]) {
    pageTitle.innerText = sectionHeaders[sectionId].title;
    pageSubtitle.innerText = sectionHeaders[sectionId].subtitle;
  }

  // Scroll to the top of the main dashboard on section load
  document.querySelector('.main-dashboard').scrollTop = 0;
}

// 2. Accordion Toggle Logic
function toggleAccordion(element) {
  const accordion = element.parentElement;
  accordion.classList.toggle('active');
  
  const content = accordion.querySelector('.accordion-content');
  if (accordion.classList.contains('active')) {
    content.style.maxHeight = content.scrollHeight + 'px';
  } else {
    content.style.maxHeight = '0px';
  }
}

// 3. Task Checklist Toggle & Persistence
function toggleCheckItem(element, taskId) {
  const checkbox = element.querySelector('input[type="checkbox"]');
  if (!checkbox) return;
  
  checkbox.checked = !checkbox.checked;
  
  if (checkbox.checked) {
    element.classList.add('completed');
  } else {
    element.classList.remove('completed');
  }
  
  // Save specific task progress to LocalStorage
  localStorage.setItem('mern-task-' + taskId, checkbox.checked);
  
  // Update progress bars
  updateGlobalProgress();
}

// Handler specifically for directly checking inside the checkbox
function syncCheckboxes() {
  const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
  checkboxes.forEach(cb => {
    const parent = cb.closest('.check-item');
    const taskId = cb.id.replace('chk-', '');
    
    if (cb.checked) {
      parent.classList.add('completed');
    } else {
      parent.classList.remove('completed');
    }
    
    localStorage.setItem('mern-task-' + taskId, cb.checked);
  });
  
  updateGlobalProgress();
}

// 4. Update overall completion progress bar and counters
function updateGlobalProgress() {
  const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
  const total = checkboxes.length;
  let checkedCount = 0;
  
  checkboxes.forEach(cb => {
    if (cb.checked) {
      checkedCount++;
    }
  });
  
  const percent = total > 0 ? Math.round((checkedCount / total) * 100) : 0;
  
  // Update HTML elements
  const progressText = document.getElementById('global-progress-text');
  const progressFill = document.getElementById('global-progress-fill');
  
  if (progressText) progressText.innerText = percent + '%';
  if (progressFill) progressFill.style.width = percent + '%';
}

// 5. Reset progress status back to empty
function resetProgress() {
  if (confirm('Are you sure you want to reset all checklist progress?')) {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.checked = false;
      const parent = cb.closest('.check-item');
      if (parent) parent.classList.remove('completed');
      
      const taskId = cb.id.replace('chk-', '');
      localStorage.removeItem('mern-task-' + taskId);
    });
    
    updateGlobalProgress();
  }
}

// Load checklists status on content loaded
function loadSavedProgress() {
  const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
  checkboxes.forEach(cb => {
    const taskId = cb.id.replace('chk-', '');
    const saved = localStorage.getItem('mern-task-' + taskId);
    
    if (saved === 'true') {
      cb.checked = true;
      const parent = cb.closest('.check-item');
      if (parent) parent.classList.add('completed');
    }
  });
  
  updateGlobalProgress();
}

// 6. API Route Filter and Live Search Spec
function filterRoutes() {
  const searchVal = document.getElementById('api-search').value.toLowerCase();
  const methodVal = document.getElementById('api-method-filter').value;
  const rows = document.querySelectorAll('.route-row');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const method = row.getAttribute('data-method');
    
    const matchesSearch = text.includes(searchVal);
    const matchesMethod = (methodVal === 'ALL' || method === methodVal);
    
    if (matchesSearch && matchesMethod) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// 7. Clipboard copy helpers
function copySnippet(btnElement) {
  const pre = btnElement.parentElement;
  const code = pre.querySelector('code').innerText;
  
  navigator.clipboard.writeText(code).then(() => {
    const originalText = btnElement.innerText;
    btnElement.innerText = 'Copied!';
    btnElement.style.color = '#10b981';
    
    setTimeout(() => {
      btnElement.innerText = originalText;
      btnElement.style.color = '';
    }, 1500);
  }).catch(err => {
    console.error('Copy snippet failure: ', err);
  });
}

// 8. Bootstrap lifecycle listeners
window.addEventListener('DOMContentLoaded', () => {
  loadSavedProgress();
  
  // Make sure clicking checkbox directly doesn't double trigger parent click list-item
  const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.addEventListener('click', (e) => {
      e.stopPropagation();
      syncCheckboxes();
    });
  });
});
