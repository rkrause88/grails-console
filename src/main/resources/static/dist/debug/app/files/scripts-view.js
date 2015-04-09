(function() {
  App.module('Files', function(Files, App, Backbone, Marionette, $, _) {
    Files.ScriptsView = Marionette.ItemView.extend({
      template: 'files/scripts',
      attributes: {
        "class": 'scripts'
      },
      events: {
        'click li .name a': 'onNameClick',
        'click li a.delete': 'onDeleteClick',
        'click ul.store a': 'onStoreClick',
        'click .up': 'onUpClick',
        'click .close-it': 'onCloseClick'
      },
      initialize: function(options) {
        var _ref, _ref1,
          _this = this;
        this.lastPaths = {};
        this.showDelete = (_ref = options.showDelete) != null ? _ref : true;
        this.showCollapse = (_ref1 = options.showCollapse) != null ? _ref1 : true;
        this.listenTo(this.collection, 'fetching', function() {
          _this.loading = true;
          return _this.render();
        });
        return this.listenTo(this.collection, 'add remove reset', function() {
          _this.loading = false;
          return _this.render();
        });
      },
      onNameClick: function(event) {
        var file, fileId;
        event.preventDefault();
        fileId = $(event.currentTarget).closest('li').data('fileId');
        file = this.collection.findWhere({
          id: fileId
        });
        if (file.isDirectory()) {
          return this.collection.fetchByStoreAndPath(file.store, file.getAbsolutePath());
        } else {
          return App.execute('showFile', file);
        }
      },
      onStoreClick: function(event) {
        var path, store, _ref;
        event.preventDefault();
        this.lastPaths[this.collection.store] = this.collection.path;
        store = $(event.currentTarget).data('store');
        path = (_ref = this.lastPaths[store]) != null ? _ref : '/';
        return this.collection.fetchByStoreAndPath(store, path);
      },
      onUpClick: function(event) {
        event.preventDefault();
        return this.collection.up();
      },
      onDeleteClick: function(event) {
        var file, fileId,
          _this = this;
        event.preventDefault();
        fileId = $(event.currentTarget).closest('li').data('fileId');
        file = this.collection.findWhere({
          id: fileId
        });
        if (confirm('Are you sure you want to delete this file?')) {
          return file.destroy().done(function() {
            return App.trigger('file:deleted', file);
          });
        }
      },
      onCloseClick: function(event) {
        event.preventDefault();
        return App.execute('toggleScripts');
      },
      serializeData: function() {
        return {
          files: this.collection.toJSON(),
          path: this.collection.path,
          currentDir: this.collection.getCurrentDir(),
          hasParent: this.collection.hasParent(),
          currentStore: App.getFileStoreByName(this.collection.store).displayName,
          fileStores: App.getAllFileStores(),
          showDelete: this.showDelete,
          showCollapse: this.showCollapse,
          loading: this.loading
        };
      }
    });
    return Handlebars.registerHelper('scriptsFileItem', function(file, options) {
      var html, iconClass, showDelete;
      showDelete = options.hash.showDelete;
      iconClass = this.type === 'dir' ? 'fa fa-folder-o' : 'fa fa-file-o';
      html = "<div class='name'><i class='" + iconClass + "'></i><a class='name' href='#'>" + file.name + "</a></div>";
      if (showDelete && this.type === 'file') {
        html += '<a class="delete" href="#">×</a>';
      }
      return new Handlebars.SafeString(html);
    });
  });

}).call(this);