const fs = require('fs');

const path = 'src/pages/user/tools/QuranFull.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `                             <ListPlus size={20} />
                           </button>
                         </>
                       )}
                     </div>
                   </div>
                 </motion.div>`;

const replacement = `                             <ListPlus size={20} />
                           </button>
                         </>
                       )}
                       </div>
                     </div>
                   </div>
                 </motion.div>`;

content = content.replace(target, replacement);
fs.writeFileSync(path, content);
