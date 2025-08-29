import PreviewView from './PreviewView';

class BookmarksView extends PreviewView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
  _message = '';
  addHandlerBookmarks(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarksView();
