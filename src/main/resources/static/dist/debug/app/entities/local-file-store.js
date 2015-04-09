(function() {
  App.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {
    /*
    File store that uses localStorage.
    */

    Entities.LocalFileStore = (function() {
      function LocalFileStore(name) {
        this.name = name;
        this._load();
      }

      LocalFileStore.prototype.storeName = 'local';

      LocalFileStore.prototype.displayName = 'Local Storage';

      LocalFileStore.prototype.syncFile = function(method, file, options) {
        return this.sync(method, file, options);
      };

      LocalFileStore.prototype.syncCollection = function(method, collection, options) {
        return this.sync(method, collection, options);
      };

      LocalFileStore.prototype.parseCollection = function(collection, response, options) {
        return response;
      };

      LocalFileStore.prototype.list = function() {
        return new Entities.FileCollection(this.fetch());
      };

      LocalFileStore.prototype.fetch = function() {
        return _.values(this.data);
      };

      LocalFileStore.prototype.find = function(file) {
        return this.data[file.id];
      };

      LocalFileStore.prototype.create = function(file) {
        file.set('lastModified', new Date().getTime());
        file.set('id', file.get('path') + file.get('name'));
        this.data[file.id] = file.toJSON();
        this._save();
        return file.toJSON();
      };

      LocalFileStore.prototype.update = function(file) {
        file.set('lastModified', new Date().getTime());
        this.data[file.id] = file.toJSON();
        this._save();
        return file.toJSON();
      };

      LocalFileStore.prototype.destroy = function(file) {
        delete this.data[file.id];
        this._save();
        return file.toJSON();
      };

      LocalFileStore.prototype.destroyAll = function() {
        this.data = {};
        return localStorage.removeItem(this.name);
      };

      LocalFileStore.prototype._save = function() {
        return localStorage.setItem(this.name, JSON.stringify(this.data));
      };

      LocalFileStore.prototype._load = function() {
        var e, file, id, store, _ref, _ref1, _results;
        store = localStorage.getItem(this.name);
        try {
          this.data = (_ref = JSON.parse(store)) != null ? _ref : {};
        } catch (_error) {
          e = _error;
          this.data = {};
        }
        _ref1 = this.data;
        _results = [];
        for (id in _ref1) {
          file = _ref1[id];
          _results.push(file.type = 'file');
        }
        return _results;
      };

      LocalFileStore.prototype.sync = function(method, file, options) {
        var dfd, resp;
        resp = void 0;
        switch (method) {
          case 'read':
            resp = file.id ? this.find(file) : this.fetch();
            break;
          case 'create':
            resp = this.create(file);
            break;
          case 'update':
            resp = this.update(file);
            break;
          case 'delete':
            resp = this.destroy(file);
        }
        dfd = $.Deferred();
        if (resp) {
          dfd.resolveWith(this, [resp]);
          if (options != null) {
            if (typeof options.success === "function") {
              options.success(resp);
            }
          }
        } else {
          dfd.rejectWith(this, ['File doesn\'t exist']);
          if (options != null) {
            if (typeof options.error === "function") {
              options.error('File doesn\'t exist');
            }
          }
        }
        return dfd;
      };

      return LocalFileStore;

    })();
    return App.on('initialize:before', function(options) {
      return App.addFileStore(new Entities.LocalFileStore('gconsole.files'));
    });
  });

}).call(this);
