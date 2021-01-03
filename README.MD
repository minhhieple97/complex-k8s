Khi chúng ta chạy "minikube start" nó sẽ chạy một VM (có thể chạy nhiều hơn VM nhưng mặc định là 1) trên máy, và mỗi VM này trong Kubernetes chúng ta coi nó như một Node và Kubernetes sẽ sử dụng các node này để chạy các object mà chúng ta tạo ra ở các file config
=> Khi chúng ta tạo các file config chúng ta sẽ đẩy nó cho Kuberctl (chính xác hơn thì là đẩy cho master) và master của Kubectl sẽ chạy các file này trong Node, toàn bộ quá trình này diễn ra trong Kubernetes Cluster (là tập hợp các Nodes + Master để quản lý các Nodes)

- Với mỗi file config chúng ta viết nó sẽ tạo ra các đối tượng (Objects)
- Các đối tượng phục vụ nhiều mục đích khác nhau như chạy một container (container ở đấy chính là container trong Docker), monitor container, thiết lập network...
  apiVersion:v1

- Giá trị của apiVersion sẽ xác định chúng ta được quyền sử dụng giá trị nào của object.

Object Types

- Pod

* Hãy tưởng tượng VM chạy như một node, node sẽ được sử dụng bởi Kubernetes để chạy một số object khác nhau
* Một trong những object cơ bản nhất của Kubernetes là Pod (kind : Pod)
* Bản thân Pod được coi như một nhóm các container và Pod cũng là đơn vị nhỏ nhất trong Kubernetes mà chúng ta cần khởi tạo nếu muốn chạy một container. sở dĩ Pod coi như một nhóm các container bởi vì trong Kubernetes không chạy các container riêng lẻ với nhau, đơn vị bé nhất mà chúng ta có thể triển khai trên Kubernetes là một nhóm (hiểu là 1 Pod)
* Mục đích phổ biến của Pod là nhóm các container có nhiệm vụ giống nhau, có mối quan hệ chặt chẽ với nhau
  VD: Chúng ta có 3 container là postgres + logger + backup-manager trong trường hợp này postgress là Primary Container còn Logger + Backup-manager (Support Container)
  3 container này có thể ở trong cùng 1 Pod do chúng có mối quan hệ chặt chẽ với nhau bởi vì nếu Primary container gặp sự cố Support Container sẽ ngừng hoạt động.
* Khi chúng ta up các file config này lên Kuctl

- Service

* Service cũng là một object trong Kubernetes, chúng ta thường sử dụng Service khi cần setup networking bên trong Kubernetes Cluster hiểu đơn giản thì nó phụ trách việc giao tiếp giữa các pods trong Kubernetes Cluster

* Trong Service còn có thêm 4 Subtype (object) là

- ClusterIP : cho phép truy cập tập hợp các pod từ object khác trong Cluster .
- NodePort: nó mở quyền truy cập tập hợp các pod cho thế giới bên ngoài (chỉ phù hợp ở môi trường development)

- LoadBalancer: Là cách cũ để có thể điều hướng các traffict vào trong cluster
- Ingress: Mở quyền truy cập tập hợp ở services ra ngoài, mục đích khá giống với LoadBalancer, hiểu đơn giản chúng ta tạo các tập yaml để cấu hình cho ingres xử lý việc routing theo mong muốn và đẩy nó là Ingres Controller, Ingres Controller sẽ xem xét current state và dựa vào tập cấu hình để việc routing được như ý muốn.

- Giải thích
  spec:
  type: NodePort
  ports: - port: 3050
  targetPort: 3000
  nodePort: 31515
  port: Pod khác có thể truy cập được Pod(multicilent theo port này), tức là thông qua port này trên Service một Pod khác có thể truy cập được Pod khác (trong trường hợp này là multi client) thông qua Service

  targetPort: Object Service cần điều hướng traffic để port nào đó trên Pod(multiclient), hiểu đơn giản Service sẽ điều hướng truy cập đến targetPort nằm trên Pod(multil client)

  nodePort: đây là port cho phép chúng ta user kiểm tra (có thể sử dụng bằng trình duyệt) Pod (multiclient) tức là chúng ta kiểm tra Pod(multiclient) thông qua service bằng nodePort, nếu chúng ta không chỉ định nodePort thì nó sẽ được sinh ra ngẫu nhiên,

  để dễ hiểu thì luồng sẽ chạy giống như thế này :

  browser => nodePort => targetPort => Pod(multiclient)

=> Master luôn luôn tracking từng node, nó sẽ biết tình trạng hoạt động của từ container trong Node và sẽ tự động restart lại container trong trường hợp nó bị crash

=> Docker compose vs Kubernetes

- Với mỗi service trong docker compose chúng ta có thể dựng lên một image từ nó, nhưng Kubernetes thì không ,nó không có nhiệm vụ build image mà nó luôn expect mọi image đã được build r.
- Mỗi service trong docker-compose cũng đại diện cho 1 container mà chúng ta muốn khởi chạy nhưng trong Kubernetes mỗi file config sẽ đại diện cho 1 object, object ở đây không đồng nghĩa là container (chúng ta sẽ đề cập đến sau).
- Những container trong cùng một file docker-compose sẽ tự động được join vào 1 network nhưng ở Kubernetes thì không, chúng ta phải tự động setup.

* Note

- Kubernetes là một hệ thống giúp triển khai các ứng dụng được container hóa.
- Nodes là một VM (khi chạy ở môi trường dev thì minikube sẽ tạo ra các Nodes cho chúng ta), có nhiệm vụ chạy các object.
- Master có 2 nhiệm vụ chính đó là:

* nhận các tệp config và tạo ra các object để Nodes chạy các object đó.
* quản lý các nodes

- Kubernetes không tạo ra các image, nó cần một image được xây dựng sẵn trong trường hợp này nó sẽ lấy image từ docker hub
- Kubernetes (master) cũng là thứ sẽ quyết định các container sẽ chạy trong nodes như thế nào, mỗi node sẽ có bao nhiêu container đang chạy
- Để triển khai một ứng dụng bạn cần phải cung cấp các file config cho master, master sẽ đọc các file config và triển khai các ứng dụng trên các Nodes, master sẽ là thứ quản lý toàn bộ các nodes, tracking sự thay đổi của từng node.
-

Để có thể truy cập vào chi tiết về object đang chạy ta sử dụng lệnh kubectl describe object_type object_name

=> Để cập nhật chúng ta sẽ update file config .yaml nhưng trong có một số field sẽ không update được, lúc này chúng ta cần đến một loại object khác trong kubernetes đó là Deployments, hiểu đơn giản rằng Deployment cho phép chúng ta chạy một tập hợp các pod mà chúng ta có quyền thay đổi chúng.
=> Sự khác biệt của Pods và Deployment

- Pods: chạy một tập hợp các container có liên hệ chặt chẽ với nhau, nó sẽ tốt cho mục đích để chạy các container có ít sự thay đổi, nó rất hiếm khi được sử dụng cho mục đích production
- Deployment : chạy một tập hợp các pods giống hệt nhau (một hoặc nhiều), nó sẽ có nhiệm vụ monitor trạng thái của mỗi pod trong nó, và được quyền update các pod nếu cần thiết, thường được sử dụng cho cả 2 mục đích dev và production

* Giải thích về file config object Deployment
  apiVersion: v1
  kind: Deployment : loại object
  metadata:
  name: client-deployment : tên object sẽ được tạo ra

  spec:
  replicas: 1 Số lượng pod sẽ được nhân bản, tất nhiên là các pod sẽ giống y hệt nhau, mỗi pod sẽ chạy với cấu hình được config như ở template

  selector: Deployment sẽ không tạo ra các pod mà nó sẽ nhờ master tạo ra các pod với "component:web" sau khi nhờ master tạo các pod xong Deployment sẽ nhóm các pod có chung "component:web" với nhau để sử lý (trong phần cấu hình template cho mỗi pod thì sẽ có labels:
  component: web, tức là nó sẽ khớp cái này và cái selector:
  matchLabels:
  component: web với nhau)
  matchLabels:
  component: web

  template: Liệt kê template (hiểu đơn giản nó như file cấu hình) cho mỗi pod chạy bên trong Deployment
  metadata:
  labels:
  component: web
  spec:
  containers: - name: client
  image: stephengrider/multi-client
  ports: - containerPort: 3000

=> Mỗi minikube như một VM và nó sẽ có địa chỉ IP riêng.
=> Chúng ta muốn truy cập vào các pods thì cần phải thông qua Service (nó cũng là một loại Object giống như Pods...)
=> Mỗi Pod cũng sẽ có IP riêng (tất nhiên nó vẫn thuộc dải IP trong Minikube)

=> Volume Object: Là một loại object cho phép các container lưu trữ data ở pod level, lợi ích
của Volume Object trong Kubernetes đó là nếu một container trong pod đó chết , pod sẽ tự động tạo ra một container mới, container này có quyền truy cập vào vào VolumeObject từ đó có được các data của container đã chết, Tuy nhiên nó có nhược điểm là nếu pod chết thì Volume cũng chết.

=> PersistenData: Nó có thể được hiểu như một vùng nhớ nằm bên ngoài pod cho phép các container trong pod có thể giao tiếp với nó, kể cả khi pod chết thì cũng không ảnh hưởng đế nó.

=> PersistentVolumeClaim: giống như một list các option, nó không thể lưu trữ được bất cứ thứ gì giống như PersistentData, các option trong PVC là thứ chúng ta sẽ define trong file PodConfig(yaml) chúng ta chỉ được chỉ định một trong số các option này trong file config, PVC là thứ sẽ liệt kê xem chúng ta sẽ có những option nào để lưu trữ.

=> Khi chúng ta trao file config cho Kubernetes nó sẽ xem xét xem option chúng ta chỉ định có sẵn hay không bên trong StaticallyProvisionedPersistentVolume đây là một nới giống như kho cung cấp các PersistentVolume có sẵn (static), nếu trong SPPV không có sẵn thì kubernetes sẽ xem xét đến DynamicallyProvisionedPersistentVolume.

=> Secrets Object: là một loại object trong kubernetes mục đích chính của nó là dùng để lưu trữ các thông tin bí mật trong cluster ví dụ như password của database
