(function() {
  App.module('Files', function(Files, App, Backbone, Marionette, $, _) {
    return Files.FilesSectionView = Marionette.Layout.extend({
      template: 'files/files-section',
      regions: {
        filePathRegion: '.file-path-region',
        storeRegion: '.store'
      },
      attributes: {
        'class': 'modal-dialog files-section-view'
      },
      events: {
        'submit form.file-info': 'onSave',
        'click button.save': 'onSave'
      },
      initialize: function(options) {
        this.scriptsView = new Files.ScriptsView({
          collection: this.collection,
          showDelete: false,
          showCollapse: false
        });
        this.listenTo(this.scriptsView, 'render', this.resize);
        return this.listenTo(this.scriptsView, 'file:selected', this.onFileSelected);
      },
      onRender: function() {
        return this.storeRegion.show(this.scriptsView);
      },
      onFileSelected: function(file) {
        return this.setName(file.get('name'));
      },
      resize: function() {
        var filesBodyHeight, filesWrapperHeight, modalBodyHeight;
        if (this.$el.is(':visible')) {
          modalBodyHeight = this.$('.modal-content').height() - this.$('.modal-header').outerHeight() - this.$('.modal-footer').outerHeight();
          this.$('.modal-body').height(modalBodyHeight);
          filesBodyHeight = modalBodyHeight - this.$('.files-header').outerHeight();
          this.$('.files-body').height(filesBodyHeight);
          this.$('.files-body div.store').height(filesBodyHeight);
          this.$('.files-body div.store .scripts').height(filesBodyHeight);
          filesWrapperHeight = filesBodyHeight - this.$('.files-body div.store .scripts > .btn-toolbar').outerHeight() - this.$('.files-body div.store .scripts > .folder').outerHeight();
          return this.$('.files-body div.store .scripts > .files-wrapper').height(filesWrapperHeight);
        }
      },
      onSave: function(event) {
        var file, fileName, path, store;
        event.preventDefault();
        fileName = this.$('input.file-name').val();
        if (!fileName) {
          return alert('File name is required.');
        } else {
          store = this.collection.store;
          path = this.collection.path;
          if (path[path.length - 1] !== '/') {
            path += '/';
          }
          file = new App.Entities.File({
            name: fileName,
            path: path,
            type: 'file'
          });
          file.store = store;
          return this.trigger('save', file);
        }
      },
      setName: function(name) {
        return this.$('input.file-name').val(name);
      }
    });
  });

}).call(this);