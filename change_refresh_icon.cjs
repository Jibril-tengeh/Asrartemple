const fs = require('fs');

let content = fs.readFileSync('src/pages/user/UserDashboard.tsx', 'utf8');

content = content.replace(
  "import { Search, LayoutGrid, Square, List, Filter, X, BookOpen, Store, Megaphone, Award, MapPin, Trophy, ShieldCheck, ChevronDown, Bookmark, Flame, RefreshCw } from 'lucide-react';",
  "import { Search, LayoutGrid, Square, List, Filter, X, BookOpen, Store, Megaphone, Award, MapPin, Trophy, ShieldCheck, ChevronDown, Bookmark, Flame, Shield } from 'lucide-react';"
);

content = content.replace(
  `        <button
          onClick={() => window.location.reload()}
          className={\`p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 h-[40px] w-[40px] flex items-center justify-center shadow-sm flex-shrink-0 transition-opacity duration-200 \${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}\`}
          title="Rafraîchir la page"
        >
          <RefreshCw size={18} />
        </button>`,
  `        <Link
          to="/tools/ruqyah"
          className={\`p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 h-[40px] w-[40px] flex items-center justify-center shadow-sm flex-shrink-0 transition-opacity duration-200 \${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}\`}
          title="Roqya"
        >
          <Shield size={18} />
        </Link>`
);

fs.writeFileSync('src/pages/user/UserDashboard.tsx', content);
