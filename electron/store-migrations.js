export default {
    '0.2.3': store => {
      store.set('PlotsLayoutDefault.defaults.layoutOA-Timeserie', true);
      let layout = store.get('PlotsLayoutDefault.defaults.layout')
      layout.map((plotLayout) => {
          if (plotLayout.plotKey === 'OATimeserie') {
            plotLayout.plotKey = 'Hydrograph';
          }
        });
      store.set('PlotsLayoutDefault.defaults.layout', layout);
    }
  }