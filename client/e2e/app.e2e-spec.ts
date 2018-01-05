import { ShareCodePage } from './app.po';

describe('share-code App', function() {
  let page: ShareCodePage;

  beforeEach(() => {
    page = new ShareCodePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
