var Class = function (parent) {
	var klass = function () {
		this.init.apply(this, arguments)
	};

	if (parent) {
		var subclass = function () {};
		subclass.prototype = parent;
		klass.prototype = new subclass
	}

	klass.prototype.init = function() {};

	klass.fn = klass.prototype;
	klass.fn.parent = klass;
	klass_super = klass.__proto__;

	return klass
}