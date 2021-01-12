import RESTSerializer from '@ember-data/serializer/rest';

export default RESTSerializer.extend({
  primaryKey: 'name',

  normalizeSecrets(payload) {
    if (payload.data.keys && Array.isArray(payload.data.keys)) {
      const connections = payload.data.keys.map(secret => ({ name: secret, backend: payload.backend }));
      return connections;
    }
  },

  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    const nullResponses = ['updateRecord', 'createRecord', 'deleteRecord'];
    const connections = nullResponses.includes(requestType)
      ? { name: id, backend: payload.backend }
      : this.normalizeSecrets(payload);
    const { modelName } = primaryModelClass;
    let transformedPayload = { [modelName]: connections };
    if (requestType === 'queryRecord') {
      transformedPayload = { [modelName]: connections };
    }
    return this._super(store, primaryModelClass, transformedPayload, id, requestType);
  },
});