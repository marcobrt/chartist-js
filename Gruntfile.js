'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.loadNpmTasks('assemble');

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Grunt package with settings
    pkg: grunt.file.readJSON('package.json'),
    year: new Date().getFullYear(),

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      assemble: {
        files: ['<%= pkg.config.source %>/site/**/*.{hbs,yml,json}'],
        tasks: ['assemble', 'bowerInstall']
      },
      js: {
        files: ['<%= pkg.config.source %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'jasmine']
      },
      sass: {
        files: ['<%= pkg.config.source %>/styles/**/*.{scss,sass}'],
        tasks: ['sass:server']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '.tmp/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= pkg.config.source %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= pkg.config.source %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= pkg.config.source %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= pkg.config.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= pkg.config.source %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              '<%= pkg.config.dist %>/*',
              '!<%= pkg.config.dist %>/.git*'
            ]
          }
        ]
      },
      server: '.tmp'
    },

    assemble: {
      options: {
        helpers: ['<%= pkg.config.source %>/site/helpers/**/*.js'],
        partials: ['<%= pkg.config.source %>/site/partials/**/*.hbs'],
        layoutdir: '<%= pkg.config.source %>/site/layouts',
        layoutext: '.hbs',
        layout: ['default'],
        data: ['<%= pkg.config.source %>/site/data/**/*.{json,yml}']
      },
      pages: {
        expand: true,
        cwd: '<%= pkg.config.source %>/site',
        src: ['*.hbs'],
        dest: '.tmp'
      }
    },

    // Automatically inject Bower components into the app
    'bowerInstall': {
      app: {
        src: ['.tmp/**/*.html'],
        ignorePath: '<%= pkg.config.source %>/',
        exclude: '<%= pkg.config.bowerExclude %>',
        dependencies: true,
        devDependencies: true
      }
    },

    // Compile SASS into CSS with libsass (node-sass)
    sass: {
      options: {
        includePaths: ['<%= pkg.config.source %>/bower_components'],
        imagePath: '<%= pkg.config.source %>/images'
      },
      dist: {
        options: {
          sourceComments: 'none'
        },
        files: [
          {
            expand: true,
            cwd: '<%= pkg.config.source %>/styles',
            src: '{,*/}*.{scss,sass}',
            ext: '.css',
            dest: '.tmp/styles'
          }
        ]
      },
      server: {
        options: {
          sourceComments: 'map'
        },
        files: [
          {
            expand: true,
            cwd: '<%= pkg.config.source %>/styles',
            src: '{,*/}*.{scss,sass}',
            ext: '.css',
            dest: '.tmp/styles'
          }
        ]
      }
    },


    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '.tmp/index.html',
      options: {
        dest: '<%= pkg.config.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= pkg.config.dist %>/{,*/}*.html'],
      css: ['<%= pkg.config.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= pkg.config.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= pkg.config.source %>/images',
            src: '{,*/}*.{png,jpg,jpeg,gif}',
            dest: '<%= pkg.config.dist %>/images'
          }
        ]
      }
    },
    svgmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= pkg.config.source %>/images',
            src: '{,*/}*.svg',
            dest: '<%= pkg.config.dist %>/images'
          }
        ],
        options: {
          plugins: [
            { removeEmptyContainers: true },
            { cleanupIDs: false },
            { removeUnknownsAndDefaults: false }
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= pkg.config.dist %>',
            src: ['*.html'],
            dest: '<%= pkg.config.dist %>'
          }
        ]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= pkg.config.source %>',
            dest: '<%= pkg.config.dist %>',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              '*.html',
              'bower_components/**/*',
              'images/{,*/}*.{webp}',
              'fonts/*'
            ]
          },
          {
            expand: true,
            cwd: '.tmp/images',
            dest: '<%= pkg.config.dist %>/images',
            src: ['generated/*']
          },
          {
            expand: true,
            cwd: '.tmp',
            dest: '<%= pkg.config.dist %>',
            src: [
              '*.html'
            ]
          }
        ]
      },
      libdist: {
        files: [
          {
            expand: true,
            cwd: '<%= pkg.config.source %>/styles',
            dest: 'libdist/scss/',
            src: [
              'modules/**/*.scss',
              'settings/**/*.scss',
              '*.scss'
            ]
          },
          {
            dest: 'libdist/',
            src: 'LICENSE'
          }
        ]

      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'sass:server'
      ],
      test: [
        'sass'
      ],
      dist: [
        'sass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    jasmine: {
      dist: {
        src: [
          'source/bower_components/jquery/dist/jquery.min.js',
          'source/bower_components/fastclick/lib/fastclick.js',
          'source/bower_components/foundation/js/foundation.min.js',
          'source/bower_components/snap.svg/dist/snap.svg-min.js',
          'source/scripts/chartist.core.js',
          'source/scripts/chartist.line.js'
        ],
        options: {
          specs: 'test/spec/**/spec-*.js',
          helpers: 'test/spec/**/helper-*.js',
          phantomjs: {
            'ignore-ssl-errors': true
          }
        }
      }
    },

    // Uglify for library js compression
    uglify: {
      libdist: {
        options: {
          banner: '/* Chartist.js <%= pkg.version %>\n * Copyright © <%= year %> Gion Kunz\n * Free to use under the FTWPL license.\n * http://www.wtfpl.net/\n */',
          sourceMap: true,
          sourceMapIncludeSources: true
        },
        files: {
          'libdist/chartist.min.js': ['source/scripts/chartist.core.js', 'source/scripts/chartist.line.js', 'source/scripts/chartist.bar.js', 'source/scripts/chartist.pie.js']
        }
      }
    },
    // CSS min for library
    cssmin: {
      libdist: {
        options: {
          banner: '/* Chartist.js <%= pkg.version %>\n * Copyright © <%= year %> Gion Kunz\n * Free to use under the FTWPL license.\n * http://www.wtfpl.net/\n */'
        },
        files: {
          'libdist/chartist.min.css': ['.tmp/styles/chartist.css']
        }
      }
    },

    // Generate documentation with JSHint 3.3 (>3.3 = no Java dependency)
    jsdoc : {
      dist : {
        src: ['README.md', 'source/scripts/**/*.js', 'test/**/*.js'],
        options: {
          destination: 'sitedist/apidoc'
        }
      }
    }
  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'assemble',
      'bowerInstall',
      'concurrent:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'connect:test',
    'jasmine'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'assemble',
    'bowerInstall',
    'useminPrepare',
    'concurrent:dist',
    'concat',
    'copy:dist',
    'cssmin:generated',
    'uglify:generated',
    'usemin',
    'htmlmin',
    'jsdoc'
  ]);

  grunt.registerTask('libdist', [
    'cssmin:libdist',
    'uglify:libdist',
    'copy:libdist'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};