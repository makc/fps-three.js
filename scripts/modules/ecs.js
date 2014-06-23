/**
 * Minimalist Entity-Component-System
 * http://if-false-panic.blogspot.com/2014/04/minimalist-entitycomponent-system.html
 */

define(function () {
  // When implementing an Entity/Component System, the main choice we have to
  // make is how to represent and link entities and components. Because this is
  // a minimalist implementation, we're going to choose a simple option. Both
  // entities and components will be Javascript objects. The components will
  // get added to the entity objects on the fly.
  //
  // Let's get started.

  // ## Entities
  //
  // The systems will need some way to query all entities. To make that
  // possible the engine will keep track of all entities which get created.
  var entities = []

  // As we said, an entity is just an object. It has no data or behaviour.
  // All we want it to do is add itself into the list of entities.
  function Entity() {
    entities.push(this)
  }

  // ## Components
  //
  // Components, of course, do have state. That's exactly what they're about.
  // Unfortunately, we don't really know what state that is. It is up to the
  // client to define component constructors.
  // 
  // What we do need to define, however, is a way to link components to
  // entities. We do that by assigning the component to a new field in the
  // entity, the name of which is the name of the type of the component. This
  // means that the client should give all component types unique names; which
  // shouldn't be too bad of a requirement to have to deal with.
  Entity.prototype.add = function(component) {
    this[component.constructor.name.toLowerCase()] = component
    return this
  }
  // Note that we return `this`; we do so to allow the caller to chain multiple
  // of these calls in one go. After all, it is quite likely that an entity
  // will have more than one component linked to it.

  // Having added components to an entity, this allows you to retrieve one from
  // an entity.
  Entity.prototype.get = function(component_constructor) {
    return this[component_constructor.name.toLowerCase()]
  }

  // To unlink the component from the entity again, we just nullify the value.
  // If no arguments were given, the entity itself is removed.
  Entity.prototype.remove = function(component_constructor) {
    if(component_constructor) {
      this[component_constructor.name.toLowerCase()] = null
    } else {
      var index = entities.indexOf(this);
      if (index > -1) {
        entities.splice(index, 1);
      }
    }
    return this
  }

  // ## Systems
  //
  // As systems are units of behaviour, systems will be modeled as simple
  // functions. Again it is up to the client to define these; the engine itself
  // can not know what that should be.

  // ## Supporting functions
  //
  // So far this minimalist implementation has been just that: minimalist. We
  // basically said that it is up to the client to define what she wants... The
  // client, however, could use some extra supporting functions to make life on
  // her side easier. The major thing she needs to be able to do is to query
  // the engine for entities which have a certain combination of components.

  // Let's start by adding a test to entities to see if it has a specific set
  // of components. We can do this easily by looping over all components and
  // checking whether the entity has the corresponding field.
  Entity.prototype.has_all = function(component_constructors) {
	for (var i = 0; i < component_constructors.length; i++) {
	  var component = this.get(component_constructors[i])
	  if (typeof component === 'undefined' || component == null)
	    return false
	}
	
	return true
  }

  // The query itself then. We'll set this up in typical callback style. That
  // is, the query will apply the specified callback against each of the
  // matching entities. E.g. `for_each([position, sound], console.log)` would
  // write all entities to console which have a position and sound component.
  // If `fn` returns true, the loop stops.
  function for_each(component_constructors, fn) {
    for (var i = 0; i < entities.length; i++) {
      var entity = entities[i]
      if (entity.has_all(component_constructors)) if (fn(entity)) break;
      // if this entity was removed by fn(), make sure we do not skip the next one
      if (entity != entities[i]) i--;
    }
  }

  // ## Public API
  //

  return {
	Entity: Entity,
	for_each: for_each
  }
});
