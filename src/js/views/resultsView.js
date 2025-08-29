import PreviewView from './PreviewView';

class ResultsView extends PreviewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for youe query . Please Try Again !';
  _message = '';
}

export default new ResultsView();
