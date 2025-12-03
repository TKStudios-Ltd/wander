class PageTimer {
    constructor(intervalFrequency = 5, collections = [], style = 'slider') {
      this.currentCollectionIndex = -1;
      this.intervalFrequency = intervalFrequency; // seconds between ticks
      this.collections = collections;
      this.players = [];
      this.faderGroups = [];
      this.style = style;
    }

    registerPlayer(player) {       
        this.players.push(player);
        console.log('players after registerSection: ', this.players)
    }

    registerFaderGroupId(faderGroupId) { // expects a jqyery selector string
      this.faderGroups.push(faderGroupId);
      console.log('registerFaderGroupId', faderGroupId);
    }
  
    start() {
      setInterval(() => {
        if (this.currentCollectionIndex < (this.collections.length - 1)) {
            this.currentCollectionIndex = (this.currentCollectionIndex + 1);
        } else {
            this.currentCollectionIndex = 0;
        }
        if (this.style == 'slider') {
          this.players.forEach((player) => {
            player.go('>');
          });
        } else {
          this.faderGroups.forEach((faderGroupId, index) => {
            this.crossfade(faderGroupId);
          });
        }
      }, this.intervalFrequency * 1000);
      
      
      
    }

    manageFaderGroupAspectHeight(faderGroupId) { 
    
      // adjust the fader Group to be the same height as the image it contains
      const faderGroupWidth = $(faderGroupId).width();
      var aspectRatio = this.getFaderGroupAspectRatio(faderGroupId);
      $(faderGroupId).css({ height: faderGroupWidth / aspectRatio });
      
      window.addEventListener('resize', function()  {
        const faderGroupWidth = $(faderGroupId).width();
        $(faderGroupId).css({ height: faderGroupWidth / aspectRatio });
      });
      
    }

    getFaderGroupAspectRatio(faderGroupId) { 
      const width = $(faderGroupId + ' img:first-child()').width();
      const height = $(faderGroupId + ' img:first-child()').height();
      const aspectRatio = width / height;
      return aspectRatio;
    }

    crossfade(faderGroupId) {
      const faderGroup = $(faderGroupId);
      const visibleDiv = $('.slide.showme', faderGroup);
      const nextDiv = $('.slide:nth-child(' + (this.currentCollectionIndex + 1) + ')', faderGroup);

      visibleDiv.removeClass('showme');
      nextDiv.addClass('showme');

    }
  }
