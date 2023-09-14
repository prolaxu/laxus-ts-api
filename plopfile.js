import pluralize from 'pluralize';
function generatePassword(passwordLength) {
    const numberChars = "0123456789";
    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const symbols = "!@%^&*_+~|?><,./-";
    const allChars = numberChars + upperChars + lowerChars + symbols;
    let randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray[3] = symbols;
    randPasswordArray = randPasswordArray.fill(allChars, 4);
    return shuffleArray(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)] })).join('');
}
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
}

export default function (plop) {
    // helper for getting last part of path and make it pascal case
    plop.setHelper('lastPartPascalCase', (text) => {
        const words = text.split('/');
        return words[words.length - 1].replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    });
    // helper for getting last part of path and make it snake case
    plop.setHelper('lastPartSnakeCase', (text) => {
        const words = text.split('/');
        return words[words.length - 1].replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toLowerCase())));
    });
    //helper for last part of path and make it snake case and plural
    plop.setHelper('lastPartSnakeCasePlural', (text) => {
        const words = text.split('/');
        const newText = words[words.length - 1].replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toLowerCase())));
        return pluralize(newText);
    });
    //helper for last part of path and make it camel case and plural
    plop.setHelper('lastPartCamelCasePlural', (text) => {
        const words = text.split('/');
        const newText = words[words.length - 1].replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toLowerCase())));
        return pluralize(newText);
    });

    // helper for last part of path and make it snake case with path /
    plop.setHelper('lastPartSnakeCaseWithPath', (text) => {
        const words = text.split('/');
        return words[words.length - 1].replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toLowerCase())));
    });
    // helper for last part of path and make it pascal case with path /
    plop.setHelper('lastPartPascalCaseWithPath', (text) => {
        const words = text.split('/');
        return words[words.length - 1].replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    });

    // controller generator
    plop.setGenerator('make:controller', {
        description: 'Create a controller for your curd',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Controller name please'
            }
        ],
        actions: [
            {
                type: 'addMany',
                destination: `${process.cwd()}/src/app/http/controllers`,
                templateFiles: 'plop-templates/app/http/controllers',
                base: 'plop-templates/app/http/controllers'
            }
        ]
    });
    // make model
    plop.setGenerator('make:model', {
        description: 'Create a model for your curd',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Model name please'
            },
            //-m 
            {
                type: 'confirm',
                name: 'migration',
                message: 'Do you want to create migration file?',
                default: true
            },
        ],
        actions: function(data) {
            const actions = [
                {
                    type: 'addMany',
                    destination: `${process.cwd()}/src/app/models`,
                    templateFiles: 'plop-templates/app/models',
                    base: 'plop-templates/app/models'
                }
            ];
            if (data.migration) {
                actions.push({
                    type: 'addMany',
                    destination: `${process.cwd()}/src/database/migrations`,
                    templateFiles: 'plop-templates/database/migrations',
                    base: 'plop-templates/database/migrations'
                });
                actions.push({
                    type: 'append',
                    path: `${process.cwd()}/src/database/migrations/index.ts`,
                    template: `export * from '@migration/{{lastPartSnakeCasePlural name}}';`,
                });
            }
            return actions;
        }
    });

    // make dto
    plop.setGenerator('make:dto', {
        description: 'Create a dto for your curd',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Dto name please'
            }
        ],
        actions:
         [
            {
                type: 'addMany',
                destination: `${process.cwd()}/src/app/http/dtos`,
                templateFiles: 'plop-templates/app/http/dto',
                base: 'plop-templates/app/http/dto'
            }
        ]
    });

    // make middleware
    plop.setGenerator('make:middleware', {
        description: 'Create a middleware for your curd',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Middleware name please'
            }
        ],
        actions: [
            {
                type: 'addMany',
                destination: `${process.cwd()}/src/app/http/middlewares`,
                templateFiles: 'plop-templates/app/http/middlewares',
                base: 'plop-templates/app/http/middlewares'
            },
        ]
    });

    // make responses
    plop.setGenerator('make:response', {
        description: 'Create a response for your curd',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Response name please'
            }
        ],
        actions: [
            {
                type: 'addMany',
                destination: `${process.cwd()}/src/app/http/responses`,
                templateFiles: 'plop-templates/app/http/responses',
                base: 'plop-templates/app/http/responses'
            }
        ]
    });

    // config generator
    plop.setGenerator('make:config', {
        description: 'Create a config for your curd',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Config name please'
            }
        ],
        actions: [
            {
                type: 'addMany',
                destination: `${process.cwd()}/src/config`,
                templateFiles: 'plop-templates/config',
                base: 'plop-templates/config'
            }
        ]
    });


    // make factory
    plop.setGenerator('make:factory', {
        description: 'Create a factory for your curd',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Factory name please'
            }
        ],
        actions: [
            {
                type: 'addMany',
                destination: `${process.cwd()}/src/database/factories`,
                templateFiles: 'plop-templates/database/factories',
                base: 'plop-templates/database/factories'
            }
        ]
    });

    // make seeder
    plop.setGenerator('make:seeder', {
        description: 'Create a seeder for your curd',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Seeder name please'
            }
        ],
        actions: [
            {
                type: 'addMany',
                destination: `${process.cwd()}/src/database/seeders`,
                templateFiles: 'plop-templates/database/seeders',
                base: 'plop-templates/database/seeders'
            }
        ]
    });

    // make migration
    plop.setGenerator('make:migration', {
        description: 'Create a migration for your curd',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Migration name please'
            }
        ],
        actions: [
            {
                type: 'addMany',
                destination: `${process.cwd()}/src/database/migrations`,
                templateFiles: 'plop-templates/database/migrations',
                base: 'plop-templates/database/migrations'
            },
            // append to database/migrations/index.ts
            {
                type: 'append',
                path: `${process.cwd()}/src/database/migrations/index.ts`,
                template: `export * from '@migration/{{lastPartSnakeCase name}}';`,

            },
        ]
    });


    // gen:crud - Curd generator create controller , model , dto , middleware , response
    plop.setGenerator('gen:crud', {
        description: 'Create a crud for your curd',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Curd name please'
            },
            {
                type: 'confirm',
                name: 'migration',
                message: 'Do you want to create migration file?',
            }
        ],
        actions:function (data){
            const actions = [
                {
                    type: 'addMany',
                    destination: `${process.cwd()}/src/app/http/controllers`,
                    templateFiles: 'plop-templates/app/http/controllers',
                    base: 'plop-templates/app/http/controllers'
                },
            ];
            actions.push({
                type: 'addMany',
                destination: `${process.cwd()}/src/app/models`,
                templateFiles: 'plop-templates/app/models',
                base: 'plop-templates/app/models'
            });
            actions.push({
                type: 'addMany',
                destination: `${process.cwd()}/src/app/http/dtos`,
                templateFiles: 'plop-templates/app/http/dtos',
                base: 'plop-templates/app/http/dtos',
            });
            // response
            actions.push({
                type: 'addMany',
                destination: `${process.cwd()}/src/app/http/responses`,
                templateFiles: 'plop-templates/app/http/responses',
                base: 'plop-templates/app/http/responses'
            });
            if(data.migration){
                actions.push({
                    type: 'addMany',
                    destination: `${process.cwd()}/src/database/migrations`,
                    templateFiles: 'plop-templates/database/migrations',
                    base: 'plop-templates/database/migrations'
                });
                actions.push({
                    type: 'append',
                    path: `${process.cwd()}/src/database/migrations/index.ts`,
                    template: `export * from '@migration/{{lastPartSnakeCasePlural name}}';`,
                });
            }
            // add routes to router
            actions.push({
                type: 'append',
                path: `${process.cwd()}/src/routes/api.ts`,
                // add before  //curd routes
                pattern: /\/\/curd routes/g,
                template: `
//  {{lastPartSnakeCasePlural name}}
router.get('/{{lastPartSnakeCasePlural name}}', {{ lastPartPascalCase name }}Controller.index);
router.post('/{{lastPartSnakeCasePlural name}}', {{ lastPartPascalCase name }}Controller.create);
router.get('/{{lastPartSnakeCasePlural name}}/:id', {{ lastPartPascalCase name }}Controller.show);
router.put('/{{lastPartSnakeCasePlural name}}/:id', {{ lastPartPascalCase name }}Controller.update);
router.delete('/{{lastPartSnakeCasePlural name}}/:id', {{ lastPartPascalCase name }}Controller.delete);
                `,
                
            }); 
            // add import {{ lastPartPascalCase name }}Controller from '@controller/{{ lastPartPascalCase name }}Controller'; at the top of file
            actions.push({
                type: 'append',
                path: `${process.cwd()}/src/routes/api.ts`,
                // add before  //controllers imports
                pattern: /\/\/controllers imports/g,
                template: `import {{ lastPartPascalCase name }}Controller from '@controller/{{ lastPartPascalCase name }}Controller';`,
            });
            
            return actions;
        }
    });
    //gen:key - Key generator create key for .env
    plop.setGenerator('gen:key', {
        description: 'Create a key for app_key in .env',
        prompts: [],
        actions: function(data) {
            const strongAppKey =generatePassword(32);
            const actions = [
                {
                    type: 'modify',
                    path: `${process.cwd()}/.env`,
                    pattern: /APP_KEY=(.*)/g,
                    template:`APP_KEY=${strongAppKey}`,
                    force: true
                }
            ];
            return actions;
        }
    });
    // gen:env - Env generator create .env file
    plop.setGenerator('gen:env', {
        description: 'Create a .env file',
        prompts: [],
        actions:function(){
            const strongAppKey =generatePassword(32);
            // copy .env.example to .env
            const actions = [
                {
                    type: 'add',
                    path: `${process.cwd()}/.env`,
                    templateFile: `${process.cwd()}/.env.example`,
                },
                {
                    type: 'modify',
                    path: `${process.cwd()}/.env`,
                    pattern: /APP_KEY=(.*)/g,
                    template:`APP_KEY=${strongAppKey}`,
                    force: true
                }
            ];
            return actions;
        }
    });


    // create app from  https://github.com/prolaxu/node-mysql-api-startter
    plop.setGenerator('create-app', {
        description: 'Create new project from node-mysql-api-startter',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Project name please'
            },
        ],
        actions:function(data){
            const actions = [
                {
                    type: 'add',
                    path: `${process.cwd()}/${data.name}`,
                    templateFile: `${process.cwd()}/node_modules/node-mysql-api-starter`,
                },
            ];
            return actions;
        }
    });

}
