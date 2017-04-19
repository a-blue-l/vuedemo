var store = {
	save( key, value ){
		// 深拷贝
		localStorage.setItem( key, JSON.stringify(value) );
	},
	fetch( key ){
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}
var todolist = store.fetch('lists');
var data = {
	list: todolist,
	todotext: '',
	edtortodos: '',
	beforetodos: '',
	visible: "all"
};
var vm = new Vue({
	el: '.content',
	data: data,
	watch: {
		// list: function(){
		// 	store.save( 'lists', this.list );
		// }
		// 深度watch
		// < ! >
		list: {
			handler: function(){
				store.save( 'lists', this.list );
			},
			deep: true
		}
	},
	methods:{
		addTodo: function(){
			todolist.push( {
				title: this.todotext,
				isChecked: false
			} );
			this.todotext = '';
		},
		deletetodo: function( item ){
			todolist.splice( todolist.indexOf(item), 1 );
		},
		edtortodo:function( item ){
			this.beforetodos = item.title
			this.edtortodos = item;
		},
		edtorTodoed: function(){
			this.edtortodos = '';
		},
		canceltodo: function( item ){
			item.title = this.beforetodos;
			this.edtortodos = '';
			this.beforetodos = ''
		}
	},
	computed:{
		nocomplate: function(){
			return this.list.filter(function(item){
				return !item.isChecked;
			}).length;
		},
		// 过滤数据
		fliterChange: function(){
			var filter = {
				all:function( todolist ){
					return todolist;
				},
				finished:function( todolist ){
					return todolist.filter(function(item){
						return item.isChecked;
					})
				},
				unfinished:function( todolist ){
					return todolist.filter(function(item){
						return !item.isChecked;
					})
				}
			}

			return filter[this.visible](todolist);
		}
	},
	// 自定义指令
	directives:{
		focus: {
			update:function(el, binding){
				if( binding.value ){
					el.focus();
				}
			}
		}
	}
})
// 监测 hash < ！ >
function hashChange(){
	var hash = window.location.hash.slice(1) || 'all';
	vm.visible = hash;
}	
hashChange();
window.addEventListener('hashchange', hashChange);